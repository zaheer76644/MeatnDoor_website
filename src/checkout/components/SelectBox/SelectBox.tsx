import clsx from "clsx";
import { type HTMLAttributes } from "react";
import { useField } from "formik";
import { type Children, type Classes } from "@/checkout/lib/globalTypes";
import { useFormContext } from "@/checkout/hooks/useForm";

export interface SelectBoxProps<TFieldName extends string>
	extends Classes,
		Children,
		Omit<HTMLAttributes<HTMLInputElement>, "children"> {
	disabled?: boolean;
	name: TFieldName;
	value: string;
}

export const SelectBox = <TFieldName extends string>({
	children,
	className,
	disabled = false,
	name,
	value,
}: SelectBoxProps<TFieldName>) => {
	const { values, handleChange } = useFormContext<Record<TFieldName, string>>();
	const [field] = useField(name);
	const selected = values[name] === value;

	return (
		<label
			className={clsx(
				"relative mb-3 flex cursor-pointer flex-row items-start justify-start rounded-xl border transition-all duration-200",
				selected
					? "border-[#ed4264] bg-gradient-to-br from-[#ed4264]/5 to-[#ff6b9d]/5 shadow-md"
					: "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm",
				disabled && "pointer-events-none opacity-50",
				className,
			)}
		>
			<input
				type="radio"
				{...field}
				onChange={handleChange}
				value={value}
				checked={selected}
				className="mt-4 ml-4 h-5 w-5 flex-shrink-0 rounded-full border-gray-300 text-[#ed4264] shadow-sm focus:border-[#ed4264] focus:ring-2 focus:ring-[#ed4264]/30 focus:ring-offset-0"
			/>
			<span className="ml-3 block w-full py-4 pr-4">{children}</span>
		</label>
	);
};
