interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  autoComplete?: string;
  required?: boolean;
}

export default function InputField({
  id,
  label,
  type,
  placeholder,
  autoComplete,
  required = false,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
      />
    </div>
  );
}
