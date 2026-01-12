import { SelectBox, type SelectBoxProps } from "@/checkout/components/SelectBox";
// import { Button } from "@/checkout/components/Button";
import { Address } from "@/checkout/components/Address";
import { type AddressFragment } from "@/checkout/graphql";
import { type AddressField } from "@/checkout/components/AddressForm/types";
import { EditIcon } from "@/checkout/assets/icons";

interface AddressSelectBoxProps<TFieldName extends string>
	extends Omit<SelectBoxProps<TFieldName>, "children"> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	address: Partial<Record<AddressField, any>>;
	onEdit: () => void;
	unavailable: boolean;
}

export const AddressSelectBox = <TFieldName extends string>({
	address,
	onEdit,
	unavailable,
	...rest
}: AddressSelectBoxProps<TFieldName>) => {
	return (
		<SelectBox {...rest} disabled={unavailable} className="rounded-xl border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md">
			<div className="flex w-full flex-col justify-between pe-8">
				<Address address={address as AddressFragment}>
					{unavailable && <p className="font-xs my-1 text-red-500">Can&apos;t ship to this address</p>}
				</Address>
				<button
					type="button"
					onClick={(event) => {
						event.stopPropagation();
						onEdit();
					}}
					aria-label="edit"
					className="group/edit pointer-events-auto absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 p-0 text-gray-600 transition-all duration-200 hover:bg-gray-100"
				>
					<EditIcon className="h-5 w-5 transition-colors duration-200 group-hover/edit:text-[#ed4264]" />
				</button>
			</div>
		</SelectBox>
	);
};
