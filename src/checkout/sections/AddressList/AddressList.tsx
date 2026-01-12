import React from "react";
import { camelCase } from "lodash-es";
import { FaPlus } from "react-icons/fa";
import { AddressSelectBox } from "../../components/AddressSelectBox";
import { type AddressFragment } from "@/checkout/graphql";
import { SelectBoxGroup } from "@/checkout/components/SelectBoxGroup";
import { useAddressAvailability } from "@/checkout/hooks/useAddressAvailability";
import { Title } from "@/checkout/components/Title";
import { type UseFormReturn } from "@/checkout/hooks/useForm";
import { type AddressListFormData } from "@/checkout/sections/AddressList/useAddressListForm";
import { FormProvider } from "@/checkout/hooks/useForm/FormProvider";

export interface AddressListProps {
	onEditChange: (id: string) => void;
	onAddAddressClick: () => void;
	checkAddressAvailability?: boolean;
	title: string;
	form: UseFormReturn<AddressListFormData>;
}

export const AddressList: React.FC<AddressListProps> = ({
	onEditChange,
	checkAddressAvailability = false,
	title,
	onAddAddressClick,
	form,
}) => {
	const {
		values: { addressList },
	} = form;

	const { isAvailable } = useAddressAvailability(!checkAddressAvailability);

	return (
		<FormProvider form={form}>
			<div className="flex flex-col">
				<Title className="mb-4">{title}</Title>
				{addressList.length < 1 && (
					<p className="mb-4 text-sm text-gray-600">You currently have no saved addresses.</p>
				)}
				<button
					onClick={onAddAddressClick}
					className="group relative inline-flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-[#ed4264] bg-transparent px-8 py-4 text-center text-lg font-bold text-[#ed4264] shadow-sm transition-all duration-300 hover:border-transparent hover:bg-gradient-to-r hover:from-[#ed4264] hover:to-[#ff6b9d] hover:text-white"
				>
					{/* Shimmer effect */}
					<div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
					{/* Button content */}
					<span className="relative z-10 flex items-center justify-center gap-2">
						<FaPlus className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
						<span>Add address</span>
					</span>
				</button>
				
				<SelectBoxGroup label="user addresses" className="mt-2">
					{addressList.map(({ id, ...rest }: AddressFragment) => {
						const identifier = `${camelCase(title)}-${id}}`;

						return (
							<AddressSelectBox
								name="selectedAddressId"
								id={identifier}
								key={identifier}
								value={id}
								address={{ ...rest }}
								onEdit={() => onEditChange(id)}
								unavailable={!isAvailable(rest)}
							/>
						);
					})}
				</SelectBoxGroup>
			</div>
		</FormProvider>
	);
};
