import compact from "lodash-es/compact";
import { type CheckoutLineFragment, type OrderLineFragment } from "@/checkout/graphql";
import { type MightNotExist } from "@/checkout/lib/globalTypes";

export const isCheckoutLine = (
	line: CheckoutLineFragment | OrderLineFragment,
): line is CheckoutLineFragment => line.__typename === "CheckoutLine";

export const getThumbnailFromLine = (line: CheckoutLineFragment) =>
	line.variant.media?.find(({ type }) => type === "IMAGE") ||
	line.variant.product.media?.find(({ type }) => type === "IMAGE");

export const getSummaryLineProps = (line: OrderLineFragment | CheckoutLineFragment) =>
	isCheckoutLine(line)
		? {
				variantName: line.variant.translation?.name || line.variant.name,
				productName: line.variant.product.translation?.name || line.variant.product.name,
				productImage: getThumbnailFromLine(line),
			}
		: {
				variantName: line.variantName,
				productName: line.productName,
				productImage: line.thumbnail,
			};

export const useSummaryLineLineAttributesText = (line: CheckoutLineFragment | OrderLineFragment): string => {
	const parsedValues =
		line.variant?.attributes?.reduce<Array<MightNotExist<string>>>(
			(result, { values }) => [
				...result,
				...values.map(({ name, dateTime, translation }) => {
					if (translation?.name) {
						return translation.name;
					}

					if (dateTime) {
						return new Intl.DateTimeFormat("EN-US", { dateStyle: "medium" }).format(new Date(dateTime));
					}

					return name;
				}),
			],
			[],
		) || [];

	return compact(parsedValues).join(", ");
};
// export const useSummaryLineLineAttributesText = (line: CheckoutLineFragment | OrderLineFragment): string => {
// 	console.log("line:", line);

// 	const parsedValues =
// 		line.variant?.attributes?.reduce<Array<MightNotExist<string>>>((result, { values }, index) => {
// 			console.log(`attribute[${index}] values:`, values);

// 			const mapped = values.map(({ name, dateTime, translation }) => {
// 				console.log("name:", name, "dateTime:", dateTime, "translation:", translation);

// 				if (translation?.name) {
// 					console.log("→ using translation.name:", translation.name);
// 					return translation.name;
// 				}

// 				if (dateTime) {
// 					const formatted = new Intl.DateTimeFormat("EN-US", {
// 						dateStyle: "medium",
// 					}).format(new Date(dateTime));

// 					console.log("→ using formatted date:", formatted);
// 					return formatted;
// 				}

// 				console.log("→ using name:", name);
// 				return name;
// 			});

// 			return [...result, ...mapped];
// 		}, []) || [];

// 	console.log("parsedValues:", parsedValues);

// 	const result = compact(parsedValues).join(", ");
// 	console.log("final result:", result);

// 	return result;
// };
