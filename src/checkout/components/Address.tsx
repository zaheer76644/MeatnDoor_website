import compact from "lodash-es/compact";
import React, { type PropsWithChildren } from "react";
import { type AddressFragment } from "@/checkout/graphql";

interface AddressProps {
	address: AddressFragment;
}

export const Address: React.FC<PropsWithChildren<AddressProps>> = ({ address, children, ...textProps }) => {
	const name = `${address.firstName} ${address.lastName}`;

	const { phone, city, countryArea, postalCode, streetAddress1, country } = address;
	const addressLine1 = compact([streetAddress1, city, postalCode]).join(", ");
	const addressLine2 = compact([countryArea, country.country]).join(", ");

	return (
		<div className="pointer-events-none flex flex-col gap-1.5">
			{/* Name */}
			<p {...textProps} className="text-lg font-bold text-gray-900">
				{name}
			</p>
			
			{/* Phone */}
			{phone && (
				<p {...textProps} className="text-sm font-medium text-gray-700">
					{phone}
				</p>
			)}
			
			{/* Address Lines with Location Icon */}
			{addressLine1 && (
				<div className="flex items-start gap-2">
					<svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#ed4264]" fill="currentColor" viewBox="0 0 20 20">
						<path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
					</svg>
					<p {...textProps} className="text-sm text-gray-600">
						{addressLine1}
					</p>
				</div>
			)}
			
			{addressLine2 && (
				<p {...textProps} className="ml-6 text-sm text-gray-600">
					{addressLine2}
				</p>
			)}
			
			{children}
		</div>
	);
};
