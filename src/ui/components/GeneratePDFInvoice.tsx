"use client";
import React, { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import base32 from "hi-base32";
import logoPdf from "@/img/log_pdf.png";
import { type OrderDetailsFragment } from "@/gql/graphql";
import { getSummaryLineProps } from "@/checkout/sections/Summary/utils";

interface GeneratePDFInvoiceProps {
	order: OrderDetailsFragment;
	deliveryDate?: string;
	deliveryTime?: string;
	handlingFee: number;
}

const BRAND = "#48181F";
const ACCENT = "#F9F1F2";
const LABEL = "#D86C84";
const STATUS_GREEN = "#00A67E";

const formatINR = (amount: number) => `₹${Math.round(amount)}`;

const toAbsoluteUrl = (src: string) => {
	if (src.startsWith("http") || src.startsWith("data:")) return src;
	if (typeof window === "undefined") return src;
	return new URL(src, window.location.origin).href;
};

const loadLogoBase64 = async (): Promise<string> => {
	const candidates: string[] = [];

	if (typeof logoPdf === "string") {
		candidates.push(logoPdf);
	} else if (logoPdf && typeof logoPdf === "object" && "src" in logoPdf) {
		candidates.push((logoPdf as { src: string }).src);
	}

	candidates.push("/img/log_pdf.png");

	for (const candidate of candidates) {
		try {
			const response = await fetch(toAbsoluteUrl(candidate));
			if (!response.ok) continue;
			const blob = await response.blob();
			const dataUrl = await new Promise<string>((resolve, reject) => {
				const reader = new FileReader();
				reader.onloadend = () => {
					if (typeof reader.result === "string") resolve(reader.result);
					else reject(new Error("Failed to read logo"));
				};
				reader.onerror = reject;
				reader.readAsDataURL(blob);
			});
			if (dataUrl) return dataUrl;
		} catch {
			// try next candidate
		}
	}

	throw new Error("Could not load invoice logo (log_pdf.png)");
};

const getNetWeight = (
	item: OrderDetailsFragment["lines"][number],
): string | null => {
	const attrs = item.variant?.attributes as
		| Array<{ attribute?: { name?: string; slug?: string }; values?: Array<{ name?: string }> }>
		| undefined;
	const fromAttr = attrs?.find(
		(attr) =>
			attr.attribute?.name === "Net Weight" ||
			attr.attribute?.slug === "net-weight" ||
			attr.attribute?.slug === "weight",
	)?.values?.[0]?.name;
	if (fromAttr) return fromAttr;
	if (item.variant?.name && item.variant.name !== "Default Title") return item.variant.name;
	return null;
};

export const GeneratePDFInvoice: React.FC<GeneratePDFInvoiceProps> = ({
	order,
	deliveryDate,
	deliveryTime,
	handlingFee,
}) => {
	const [isGenerating, setIsGenerating] = useState(false);
	const orderNumber = order.number;
	const _encoded = base32.encode(orderNumber).replace(/=+$/, "");

	const generatePDF = async () => {
		try {
			setIsGenerating(true);

			const logoBase64 = await loadLogoBase64();

			const orderDate = new Date(order.created).toLocaleString("en-IN", {
				day: "2-digit",
				month: "short",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit",
				hour12: true,
			});

			const today = new Date();
			const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(
				today.getMonth() + 1,
			).padStart(2, "0")}/${today.getFullYear()}`;

			const shippingAddress = order.shippingAddress as
				| (NonNullable<OrderDetailsFragment["shippingAddress"]> & {
						firstName?: string | null;
						lastName?: string | null;
				  })
				| null
				| undefined;

			const billToName = [shippingAddress?.firstName, shippingAddress?.lastName]
				.filter(Boolean)
				.join(" ")
				.trim();

			const productLines = order.lines.filter((item) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
				const { productName } = getSummaryLineProps(item as any);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
				return productName?.toLowerCase() !== "handling fee";
			});

			const itemsHTML = productLines
				.map((item, index) => {
					const savingAmount = parseFloat(
						(
							item.variant?.attributes as Array<{
								attribute?: { name?: string };
								values?: Array<{ name?: string }>;
							}>
						)?.find((attr) => attr.attribute?.name === "Saving Amount")?.values?.[0]?.name || "0",
					);

					const grossAmount = parseFloat(String(item.undiscountedUnitPrice?.gross?.amount || 0));
					const quantity = item.quantity;
					const unitPrice = savingAmount > 0 ? savingAmount : grossAmount;
					const amount = unitPrice * quantity;
					const discount = Math.max(0, (unitPrice - grossAmount) * quantity);
					const taxable = quantity * grossAmount;
					const weight = getNetWeight(item);

					return `
						<tr>
							<td class="c-center">${index + 1}</td>
							<td class="c-item">
								<span class="item-name">${item.productName}</span>
								${weight ? `<span class="item-meta">(${weight})</span>` : ""}
							</td>
							<td class="c-center">${quantity}</td>
							<td class="c-center">${formatINR(unitPrice)}</td>
							<td class="c-center">${formatINR(amount)}</td>
							<td class="c-center">${formatINR(discount)}</td>
							<td class="c-center">${formatINR(taxable)}</td>
						</tr>
					`;
				})
				.join("");

			const paymentMode = order.metadata?.find((item) => item.key === "paymentMode")?.value || "";
			const paymentLabel =
				paymentMode === "cash_on_delivery"
					? "Cash On Delivery"
					: paymentMode
						? paymentMode.replace(/_/g, " ")
						: "Online Payment";

			const isDelivered = String(order.status) === "FULFILLED";
			const statusLabel = isDelivered
				? "DELIVERED"
				: String(order.status) === "UNFULFILLED"
					? "PROCESSING"
					: String(order.status);

			const itemsTotal = Math.round(
				(order.subtotal?.gross?.amount || 0) - handlingFee + (order.discount?.amount || 0),
			);
			const deliveryCharge = order.shippingPrice?.gross?.amount ?? 0;
			const couponAmount = order.discount?.amount || 0;
			const grandTotal = order.total?.gross?.amount || 0;
			const currency = order.total?.gross?.currency || "INR";
			const deliverySlot = [deliveryDate, deliveryTime].filter(Boolean).join(" ") || "N/A";

			const html = `
				<html>
					<head>
						<style>
							* { margin: 0; padding: 0; box-sizing: border-box; }
							body {
								font-family: Arial, Helvetica, sans-serif;
								background: #ffffff;
								color: #1a1a1a;
							}
							.page {
								width: 734px;
								padding: 6px 0 12px;
								margin: 0 auto;
								background: #ffffff;
							}
							.logo {
								width: 170px;
								height: auto;
								display: block;
								border-radius: 2px;
							}
							.divider {
								border: 0;
								border-top: 1px solid #e8e8e8;
								margin: 8px 0 10px;
							}
							.parties-table {
								width: 100%;
								border-collapse: collapse;
								margin-bottom: 10px;
							}
							.parties-table td {
								border: none !important;
								padding: 0 !important;
								background: transparent !important;
								vertical-align: top;
								width: 50%;
							}
							.eyebrow {
								color: ${LABEL};
								font-size: 10px;
								font-weight: 700;
								letter-spacing: 0.14em;
								text-transform: uppercase;
								margin-bottom: 5px;
							}
							.party-title {
								font-size: 13px;
								font-weight: 700;
								color: #111111;
								margin-bottom: 3px;
							}
							.party p {
								font-size: 11px;
								color: #444444;
								line-height: 1.45;
								margin: 1px 0;
							}
							.info-table {
								width: 100%;
								border-collapse: collapse;
								margin-bottom: 12px;
								background: ${ACCENT};
								border: 1px solid #eadfe2;
							}
							.info-table td {
								width: 33.33%;
								padding: 8px 12px !important;
								border: none !important;
								border-right: 1px solid #eadfe2 !important;
								background: ${ACCENT} !important;
								vertical-align: top;
								text-align: left !important;
							}
							.info-table td:last-child {
								border-right: none !important;
							}
							.info-table .eyebrow { margin-bottom: 2px; }
							.info-table .val {
								font-size: 12px;
								font-weight: 700;
								color: #111111;
								text-align: left;
							}
							.items-table {
								width: 100%;
								border-collapse: collapse;
								margin-bottom: 12px;
							}
							.items-table thead th {
								background: ${BRAND};
								color: #ffffff;
								font-size: 10px;
								font-weight: 700;
								letter-spacing: 0.06em;
								text-transform: uppercase;
								padding: 9px 8px;
								text-align: center;
								border: 1px solid ${BRAND};
							}
							.items-table thead th.left { text-align: left; }
							.items-table tbody td {
								border: 1px solid #e6e6e6;
								padding: 10px 8px;
								font-size: 11px;
								vertical-align: middle;
								background: #ffffff;
							}
							.c-center { text-align: center; }
							.c-item { text-align: left; }
							.item-name {
								display: block;
								font-weight: 700;
								color: #111111;
							}
							.item-meta {
								display: block;
								margin-top: 2px;
								font-size: 10px;
								font-weight: 400;
								color: #777777;
							}
							.bottom-table {
								width: 100%;
								border-collapse: collapse;
							}
							.bottom-table > tbody > tr > td {
								border: none !important;
								padding: 0 !important;
								background: transparent !important;
								vertical-align: top;
							}
							.notes h4 {
								font-size: 12px;
								font-weight: 700;
								margin-bottom: 6px;
								color: #111111;
							}
							.notes ol {
								padding-left: 15px;
								margin-bottom: 12px;
							}
							.notes li {
								font-size: 10px;
								color: #666666;
								line-height: 1.5;
								margin: 2px 0;
							}
							.thanks {
								border-top: 1px solid #e8e8e8;
								padding-top: 10px;
								font-size: 11px;
								font-weight: 700;
								font-style: italic;
								color: ${BRAND};
							}
							.brand-footer {
								margin-top: 16px;
								text-align: center;
								font-size: 10px;
								color: #9a9a9a;
							}
						</style>
					</head>
					<body>
						<div class="page">
							<!-- Header: logo | meta (fixed 240px right column) -->
							<table width="734" cellpadding="0" cellspacing="0" border="0" style="width:734px; border-collapse:collapse; margin-bottom:8px;">
								<tr>
									<td valign="top" style="border:none; padding:0; width:494px;">
										<img class="logo" src="${logoBase64}" alt="MEATnDOOR" />
									</td>
									<td valign="top" style="border:none; padding:0; width:240px;">
										<table width="240" cellpadding="0" cellspacing="0" border="0" style="width:240px; border-collapse:collapse; table-layout:fixed;">
											<tr>
												<td style="text-align:right; color:${BRAND}; font-size:14px; font-weight:700; letter-spacing:0.1em;">
													TAX INVOICE
												</td>
											</tr>
											<tr>
												<td style="width:240px; text-align:right; font-size:10px; color:#222222; padding-top:6px; line-height:1.4;">
													<strong>Invoice No:</strong> ${_encoded}${order.number}
												</td>
											</tr>
											<tr>
												<td style="width:240px; text-align:right; font-size:10px; color:#222222; line-height:1.4;">
													<strong>Invoice Date:</strong> ${formattedDate}
												</td>
											</tr>
											<tr>
												<td style="width:240px; text-align:right; font-size:10px; color:#222222; line-height:1.4;">
													<strong>Order Placed:</strong> ${orderDate}
												</td>
											</tr>
											<tr>
												<td style="width:240px; text-align:right; font-size:10px; color:#222222; line-height:1.4;">
													<strong>Delivery:</strong> ${deliverySlot}
												</td>
											</tr>
											<tr>
												<td style="width:240px; text-align:right; padding-top:5px;">
												<div style="margin-bottom: 0; display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
									<div style="font-size:10px; font-weight:700;">Status:</div> 
									<div style="background:${isDelivered ? STATUS_GREEN : LABEL}; color: white; padding: 0px 10px 12px 10px; border-radius: 5px; font-size:10px; font-weight:700; ">${statusLabel}</div> 
								</div>
							</div>
													
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>

							<hr class="divider" />

							<table class="parties-table" width="734" cellpadding="0" cellspacing="0" border="0">
								<tr>
									<td align="left">
										<div class="eyebrow">Sold By</div>
										<div class="party-title">Meatndoor Fresh Foods</div>
										<p style="font-size: 10px;">301, Tarun Bharat Building, 7th Road,<br/>Santacruz East, Mumbai 400055</p>
										<p style="font-size: 10px;">FSSAI: 11525005000328</p>
										<p style="font-size: 10px;">GSTN: 27AADPQ5578N1ZW</p>
									</td>
									<td align="right">
										<div class="eyebrow">Bill To</div>
										${billToName ? `<div class="party-title">${billToName}</div>` : ""}
										<p style="font-size: 10px;">${shippingAddress?.streetAddress1 || ""}</p>
										${shippingAddress?.streetAddress2 ? `<p>${shippingAddress.streetAddress2}</p>` : ""}
										<p style="font-size: 10px;">${[shippingAddress?.city, shippingAddress?.postalCode].filter(Boolean).join(" - ")}${
											shippingAddress?.country?.country ? `, ${shippingAddress.country.country}` : ""
										}</p>
										<p style="font-size: 10px;">Phone: ${shippingAddress?.phone || "N/A"}</p>
									</td>
								</tr>
							</table>

							<table class="info-table" width="734" cellpadding="0" cellspacing="0" border="0">
								<tr>
									<td>
										<div class="eyebrow">Payment Method</div>
										<div class="val">${paymentLabel}</div>
									</td>
									<td>
										<div class="eyebrow">Place of Supply</div>
										<div class="val">Maharashtra</div>
									</td>
									<td>
										<div class="eyebrow">Items</div>
										<div class="val">${productLines.length}</div>
									</td>
								</tr>
							</table>

							<table class="items-table" width="734" cellpadding="0" cellspacing="0" border="0">
								<thead>
									<tr>
										<th style="width:34px">#</th>
										<th class="left">Item Description</th>
										<th style="width:46px">Qty</th>
										<th style="width:78px">Unit Price</th>
										<th style="width:78px">Amount</th>
										<th style="width:78px">Discount</th>
										<th style="width:78px">Sub Total</th>
									</tr>
								</thead>
								<tbody>${itemsHTML}</tbody>
							</table>

							<!-- Notes + totals: totals column locked to 240px (same as TAX INVOICE column) -->
							<table class="bottom-table" width="734" cellpadding="0" cellspacing="0" border="0">
								<tr>
									<td valign="top" style="width:470px; padding-right:24px !important;">
										<div class="notes">
											<h4>Notes</h4>
											<ol>
												<li>This is a computer generated invoice; signature and stamp are not required.</li>
												<li>Refunds are processed within 48 hours and may take 8–9 days to reflect in your bank account.</li>
												<li>Questions? Email us at support@meatndoor.com</li>
											</ol>
											<div class="thanks">Thank you for shopping with MEATnDOOR</div>
										</div>
									</td>
									<td valign="top" style="width:240px;">
										<table width="240" cellpadding="0" cellspacing="0" border="0" style="width:240px; border-collapse:collapse; table-layout:fixed;">
											<tr>
												<td style="width:150px; text-align:left; color:#555555; font-size:11px; border-bottom:1px solid #e8e8e8; padding:7px 0;">Items Total</td>
												<td style="width:90px; text-align:right; color:#111111; font-size:11px; font-weight:700; border-bottom:1px solid #e8e8e8; padding:7px 0;">${formatINR(itemsTotal)}</td>
											</tr>
											<tr>
												<td style="width:150px; text-align:left; color:#555555; font-size:11px; border-bottom:1px solid #e8e8e8; padding:7px 0;">Delivery Charge</td>
												<td style="width:90px; text-align:right; color:#111111; font-size:11px; font-weight:700; border-bottom:1px solid #e8e8e8; padding:7px 0;">${deliveryCharge ? formatINR(deliveryCharge) : "Free"}</td>
											</tr>
											<tr>
												<td style="width:150px; text-align:left; color:#555555; font-size:11px; border-bottom:1px solid #e8e8e8; padding:7px 0;">Handling Fee</td>
												<td style="width:90px; text-align:right; color:#111111; font-size:11px; font-weight:700; border-bottom:1px solid #e8e8e8; padding:7px 0;">${formatINR(handlingFee)}</td>
											</tr>
											<tr>
												<td style="width:150px; text-align:left; color:#555555; font-size:11px; border-bottom:1px solid #e8e8e8; padding:7px 0;">Coupon${order.voucherCode ? ` (${order.voucherCode})` : ""}</td>
												<td style="width:90px; text-align:right; color:#111111; font-size:11px; font-weight:700; border-bottom:1px solid #e8e8e8; padding:7px 0;">${couponAmount ? `- ${formatINR(couponAmount)}` : formatINR(0)}</td>
											</tr>
											<tr>
												<td style="width:150px; text-align:left; color:#555555; font-size:11px; border-bottom:1px solid #e8e8e8; padding:7px 0;">Instant Discount</td>
												<td style="width:90px; text-align:right; color:#111111; font-size:11px; font-weight:700; border-bottom:1px solid #e8e8e8; padding:7px 0;">${formatINR(0)}</td>
											</tr>
											<tr>
												<td style="width:150px; text-align:left; color:#555555; font-size:11px; border-bottom:1px solid #e8e8e8; padding:7px 0;">Meatndoor Cash</td>
												<td style="width:90px; text-align:right; color:#111111; font-size:11px; font-weight:700; border-bottom:1px solid #e8e8e8; padding:7px 0;">${formatINR(0)}</td>
											</tr>
											<tr>
												<td style="width:150px; background:${BRAND}; color:#ffffff; font-size:13px; font-weight:700; text-align:left; padding:11px 10px;">Grand Total</td>
												<td style="width:90px; background:${BRAND}; color:#ffffff; font-size:13px; font-weight:700; text-align:right; padding:11px 10px; white-space:nowrap;">${formatINR(grandTotal)} ${currency}</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>

							<div class="brand-footer">MEATnDOOR · Quality At Doorstep · www.meatndoor.com</div>
						</div>
					</body>
				</html>
			`;

			const tempDiv = document.createElement("div");
			tempDiv.innerHTML = html;
			tempDiv.style.position = "absolute";
			tempDiv.style.left = "-9999px";
			tempDiv.style.top = "0";
			tempDiv.style.width = "794px"; // A4 ~96dpi with side padding
			tempDiv.style.padding = "0 30px";
			tempDiv.style.boxSizing = "border-box";
			tempDiv.style.backgroundColor = "#ffffff";
			document.body.appendChild(tempDiv);

			const logoImg = tempDiv.querySelector<HTMLImageElement>("img.logo") ;
			if (logoImg && !logoImg.complete) {
				await new Promise<void>((resolve) => {
					logoImg.onload = () => resolve();
					logoImg.onerror = () => resolve();
					setTimeout(() => resolve(), 1500);
				});
			} else {
				await new Promise((resolve) => setTimeout(resolve, 200));
			}

			const canvas = await html2canvas(tempDiv, {
				scale: 2,
				useCORS: true,
				allowTaint: true,
				backgroundColor: "#ffffff",
				logging: false,
				width: tempDiv.scrollWidth,
				height: tempDiv.scrollHeight,
			});

			document.body.removeChild(tempDiv);

			const imgData = canvas.toDataURL("image/png");
			const pdf = new jsPDF("p", "mm", "a4");
			const imgWidth = 210;
			const pageHeight = 297;
			const imgHeight = (canvas.height * imgWidth) / canvas.width;
			let heightLeft = imgHeight;
			let position = 0;

			pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
			heightLeft -= pageHeight;

			while (heightLeft > 2) {
				position = heightLeft - imgHeight;
				pdf.addPage();
				pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
				heightLeft -= pageHeight;
			}

			pdf.save(`order_${_encoded}_invoice.pdf`);
		} catch (error) {
			console.error("Error generating PDF:", error);
			alert("Failed to generate PDF. Please try again.");
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<button
			onClick={generatePDF}
			disabled={isGenerating}
			className="rounded-lg bg-gradient-to-r from-[#ed4264] to-[#ff6b9d] px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#ed4264]/50 disabled:cursor-not-allowed disabled:opacity-50"
		>
			{isGenerating ? "Generating PDF..." : "Generate PDF Invoice"}
		</button>
	);
};
