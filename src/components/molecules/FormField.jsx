import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import TextArea from "@/components/atoms/TextArea";

const FormField = ({ type = "input", label, error, options, ...props }) => {
  switch (type) {
    case "select":
      return (
        <Select label={label} error={error} {...props}>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      );
    case "textarea":
      return <TextArea label={label} error={error} {...props} />;
    default:
      return <Input label={label} error={error} {...props} />;
  }
};

export default FormField;