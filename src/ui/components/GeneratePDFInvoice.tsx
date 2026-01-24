"use client";
import React, { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { type OrderDetailsFragment } from "@/gql/graphql";
import { getSummaryLineProps } from "@/checkout/sections/Summary/utils";

interface GeneratePDFInvoiceProps {
	order: OrderDetailsFragment;
	deliveryDate?: string;
	deliveryTime?: string;
	handlingFee: number;
}

export const GeneratePDFInvoice: React.FC<GeneratePDFInvoiceProps> = ({
	order,
	deliveryDate,
	deliveryTime,
	handlingFee,
}) => {
	const [isGenerating, setIsGenerating] = useState(false);

	const generatePDF = async () => {
		try {
			setIsGenerating(true);

			// Load logo as base64 to avoid CORS issues
			let logoBase64 = "";
			try {
				// Try loading from public folder first
				const logoResponse = await fetch(window.location.origin + "/img/logo.png");
				if (logoResponse.ok) {
					const logoBlob = await logoResponse.blob();
					logoBase64 = await new Promise<string>((resolve, reject) => {
						const reader = new FileReader();
						reader.onloadend = () => {
							if (reader.result) {
								resolve(reader.result as string);
							} else {
								reject(new Error("Failed to read logo"));
							}
						};
						reader.onerror = reject;
						reader.readAsDataURL(logoBlob);
					});
				} else {
					throw new Error("Logo not found");
				}
			} catch (error) {
				console.warn("Could not load logo from local, trying external:", error);
				// Fallback: Try to load external logo and convert to base64
				try {
					const externalResponse = await fetch("https://meatndoor.com/assets/images/logo/log.png", {
						mode: "cors",
					});
					if (externalResponse.ok) {
						const logoBlob = await externalResponse.blob();
						logoBase64 = await new Promise<string>((resolve, reject) => {
							const reader = new FileReader();
							reader.onloadend = () => {
								if (reader.result) {
									resolve(reader.result as string);
								} else {
									reject(new Error("Failed to read external logo"));
								}
							};
							reader.onerror = reject;
							reader.readAsDataURL(logoBlob);
						});
					} else {
						// Final fallback - use external URL directly (may not work due to CORS)
						logoBase64 = "https://meatndoor.com/assets/images/logo/log.png";
					}
				} catch (externalError) {
					console.warn("Could not load external logo:", externalError);
					// Final fallback
					logoBase64 = "https://meatndoor.com/assets/images/logo/log.png";
				}
			}

			// Create HTML content
			const orderDate = new Date(order.created).toLocaleDateString("en-US", {
				month: "long",
				day: "numeric",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			});

			const today = new Date();
			const day = String(today.getDate()).padStart(2, "0");
			const month = String(today.getMonth() + 1).padStart(2, "0");
			const year = today.getFullYear();
			const formattedDate = `${day}/${month}/${year}`;

			// Encode order number (using simple base32-like encoding)
			const encoded = btoa(order.number).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");

			// Generate items HTML
			const itemsHTML = order.lines
				.filter((item) => {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
					const { productName } = getSummaryLineProps(item as any);
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
					return productName?.toLowerCase() !== "handling fee";
				})
				.map((item) => {
					// Get saving amount (default to 0 if not found)
					const savingAmount = parseFloat(
						// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
						(item.variant?.attributes as Array<{ attribute?: { name?: string }; values?: Array<{ name?: string }> }>)?.find(
							(attr) => attr.attribute?.name === "Saving Amount"
						)?.values?.[0]?.name || "0"
					);

					// Get gross price (default to 0 if not found)
					const grossAmount = parseFloat(String(item.unitPrice?.gross?.amount || 0));

					const quantity = item.quantity;
					// Calculate discounted price
					const discountedPrice = (savingAmount - grossAmount) * quantity;

					const itemTotal = savingAmount * quantity;
					const subTotal = quantity * grossAmount;

					return `
						<tr>
							<td>${item.productName}</td>
							<td>${item.quantity}</td> 
							<td>${savingAmount.toFixed(2)}</td>
							<td>${itemTotal.toFixed(2)}</td>
							<td>${discountedPrice.toFixed(2)}</td>
							<td>0.00%</td>
							<td>${subTotal.toFixed(2)}</td>
						</tr>
					`;
				})
				.join("");

			const paymentMode = order.metadata?.find((item) => item.key === "paymentMode")?.value || "";

			const html = `
				<html>
					<head>
						<style>
							* {
								margin: 0;
								padding: 0;
								box-sizing: border-box;
							}
							body {
								font-family: Arial, sans-serif;
								margin: 20px;
								color: #333;
								background: white;
							}
							.header {
								display: flex;
								justify-content: space-between;
								align-items: flex-start;
								margin-bottom: 20px;
							}
							.logo-container {
								flex: 0 0 auto;
							}
							.logo-container img {
								max-width: 250px;
								height: auto;
								display: block;
							}
							.invoice-title {
								font-size: 28px;
								font-weight: bold;
								text-align: center;
								flex: 1;
								margin-top: 20px;
							}
							.invoice-header {
								text-align: right;
								flex: 0 0 auto;
								min-width: 250px;
							}
							.invoice-header h2 {
								font-size: 18px;
								margin-bottom: 8px;
								color: #333;
								font-weight: bold;
							}
							.invoice-header p, .invoice-header div {
								font-size: 14px;
								margin: 6px 0;
								color: #333;
								line-height: 1.5;
							}
							.invoice-header strong {
								font-weight: bold;
								color: #333;
							}
							.seller-buyer {
								display: flex;
								justify-content: space-between;
								background: #f3f1f1ff;
								padding: 15px 25px;
								border-radius: 5px;
								margin-bottom: 20px;
								gap: 20px;
							}
							.seller, .buyer {
								flex: 1;
							}
							.seller h3, .buyer h3 {
								font-size: 16px;
								margin-bottom: 8px;
								color: #333;
							}
							.seller p, .buyer p {
								font-size: 13px;
								margin: 4px 0;
								color: #555;
							}
							.divider {
								width: 2px;
								background: #a3a3a3ff;
								border-radius: 5px;
								flex-shrink: 0;
							}
							.buyer {
								text-align: right;
							}
							.payment-info {
								display: flex;
								justify-content: space-between;
								margin-bottom: 20px;
								gap: 20px;
							}
							.payment-method, .supply-place {
								flex: 1;
							}
							.payment-method p, .supply-place p {
								font-size: 14px;
								margin: 4px 0;
							}
							table {
								width: 100%;
								border-collapse: collapse;
								margin-bottom: 20px;
							}
							th, td {
								border: 1px solid #ddd;
								padding: 10px 8px;
								text-align: left;
								font-size: 13px;
							}
							th {
								background-color: #f8f8f8;
								font-weight: bold;
							}
							td {
								background-color: white;
							}
							.items-table {
								margin-bottom: 20px;
							}
							#bill {
								text-align: right;
								margin-top: 20px;
								font-size: 14px;
							}
							#bill .bill-row {
								display: flex;
								justify-content: flex-end;
								gap: 20px;
								margin: 6px 0;
							}
							#bill .bill-label {
								min-width: 180px;
								text-align: right;
							}
							#bill .bill-value {
								min-width: 100px;
								text-align: right;
							}
							#bill .grand-total {
								border-top: 2px solid #333;
								padding-top: 8px;
								margin-top: 8px;
								font-weight: bold;
								font-size: 16px;
							}
							#note {
								text-align: left;
								font-style: italic;
								margin-top: 30px;
								font-size: 0.9em;
								color: #666;
								line-height: 1.6;
							}
							#note p {
								margin: 6px 0;
							}
							.status-badge {
								padding: 6px 14px;
								border-radius: 4px;
								color: white;
								font-size: 13px;
								font-weight: 600;
								display: inline-block;
								margin-left: 8px;
								text-transform: capitalize;
								vertical-align: middle;
								box-shadow: 0 1px 3px rgba(0,0,0,0.2);
							}
						</style>
					</head>
					<body>
						<div class="header">
							<div class="logo-container">
								<img src="${logoBase64}" alt="Company Logo" />
							</div>
							<div class="invoice-title">Invoice</div>
							<div class="invoice-header"> 
								<h2>Order #${encoded}${order.number}</h2> 
								<div style="margin-bottom: 8px;"><strong>Date:</strong> ${formattedDate}</div>
								<p style="margin-bottom: 8px;"><strong>Delivery Between:</strong> ${deliveryDate || "N/A"} ${deliveryTime || "N/A"}</p>
								<p style="margin-bottom: 8px;"><strong>Placed at:</strong> ${orderDate}</p>
								<div style="margin-bottom: 0; display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
									<strong>Status:</strong> 
									<strong>${String(order.status) === "FULFILLED" ? "Delivered" : String(order.status) === "UNFULFILLED" ? "Processing" : String(order.status)}</strong> 
								</div>
							</div>
						</div>

						<div class="seller-buyer">
							<div class="seller">
								<h3>Sold by:</h3>
								<h3>Meatndoor Fresh Foods</h3>
								<p>301, Tarun Bharat Building, 7th Road, Santacruz East Mumbai 400055</p>
								<p>FSSAI License Number: 11525005000328</p>
								<p>GSTN: 27AADPQ5578N1ZW</p> 
							</div>
							<div class="divider"></div>
							<div class="buyer">
								<h3>Buyer/Consignee:</h3>
								<p>${order.shippingAddress?.streetAddress1 || ""}</p>
								${order.shippingAddress?.streetAddress2 ? `<p>${order.shippingAddress.streetAddress2}</p>` : ""}
								<p>${order.shippingAddress?.city || ""}, ${order.shippingAddress?.postalCode || ""}, ${order.shippingAddress?.country?.country || ""}</p> 
								<p>Phone: ${order.shippingAddress?.phone || ""}</p>  
							</div>
						</div>

						<div class="payment-info">
							<div class="payment-method">
								<p><strong>Payment Method:</strong></p>
								<p>${paymentMode === 'cash_on_delivery' ? "Cash on Delivery" : "Online Payment"}</p>
							</div> 
							<div class="supply-place">
								<p><strong>Place of Supply:</strong></p>
								<p>Maharashtra</p>
							</div>
						</div>

						<table class="items-table">
							<thead>
								<tr>
									<th>Item</th> 
									<th>Qty</th>
									<th>Price</th>
									<th>Items Total</th>
									<th>Discount</th>
									<th>GST Rate</th>
									<th>Subtotal</th>
								</tr>
							</thead>
							<tbody>
								${itemsHTML}
							</tbody>
						</table>

						<div id="bill">
							<div class="bill-row">
								<div class="bill-label">Total:</div>
								<div class="bill-value">${Math.round((order.subtotal?.gross?.amount || 0) - handlingFee - (order.shippingPrice?.gross?.amount || 0))}</div>
							</div>
							<div class="bill-row">
								<div class="bill-label">Delivery Charge:</div>
								<div class="bill-value">${order.shippingPrice?.gross?.amount || "Free"}</div>
							</div>
							<div class="bill-row">
								<div class="bill-label">Handling Fee:</div>
								<div class="bill-value">${handlingFee}</div>
							</div>
							<div class="bill-row">
								<div class="bill-label">Coupon Applied: (${order.voucherCode || ""})</div>
								<div class="bill-value">${order.discount?.amount ? "- " + (order.discount.amount || 0) : "0"}</div>
							</div>
							<div class="bill-row">
								<div class="bill-label">Instant Discount:</div>
								<div class="bill-value">0</div>
							</div>
							<div class="bill-row">
								<div class="bill-label">Meatndoor Cash:</div>
								<div class="bill-value">0</div>
							</div>
							<div class="bill-row grand-total">
								<div class="bill-label">Grand Total:</div>
								<div class="bill-value">₹${order.total?.gross?.amount} ${order.total?.gross?.currency}</div>
							</div>
						</div>

						<div id="note">
							<p>*This is a computer generated invoice, hence signature and stamp is not required</p>
							<p>Refund will be processed from our end within 48 hours but may take upto 8-9 days to credit into your bank account.</p>
							<p>Thank you for using meatndoor.com Let us know how we did, by sending your feedback to support@meatndoor.com</p>
						</div> 
					</body>
				</html>
			`;

			// Create a temporary div to render HTML
			const tempDiv = document.createElement("div");
			tempDiv.innerHTML = html;
			tempDiv.style.position = "absolute";
			tempDiv.style.left = "-9999px";
			tempDiv.style.width = "210mm"; // A4 width
			tempDiv.style.backgroundColor = "white";
			tempDiv.style.padding = "20px";
			document.body.appendChild(tempDiv);

			// Wait for images to load
			await new Promise((resolve) => setTimeout(resolve, 500));

			// Convert HTML to canvas then to PDF
			const canvas = await html2canvas(tempDiv, {
				scale: 2,
				useCORS: true,
				allowTaint: true,
				backgroundColor: "#ffffff",
				logging: false,
				width: tempDiv.scrollWidth,
				height: tempDiv.scrollHeight,
			});

			// Remove temporary div
			document.body.removeChild(tempDiv);

			const imgData = canvas.toDataURL("image/png");
			const pdf = new jsPDF("p", "mm", "a4");
			const imgWidth = 210; // A4 width in mm
			const pageHeight = 295; // A4 height in mm
			const imgHeight = (canvas.height * imgWidth) / canvas.width;
			let heightLeft = imgHeight;

			let position = 0;

			pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
			heightLeft -= pageHeight;

			while (heightLeft >= 0) {
				position = heightLeft - imgHeight;
				pdf.addPage();
				pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
				heightLeft -= pageHeight;
			}

			// Save the PDF
			pdf.save(`order_${order.number}_invoice.pdf`);
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

