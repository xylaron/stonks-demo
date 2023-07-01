type OTPInputProps = {
  value: string;
  onChange: (value: string) => void;
  size?: number;
  regex?: RegExp;
};

const OTPInput: React.FC<OTPInputProps> = (props: OTPInputProps) => {
  const { size = 6, regex = /[0-9]{1}/, value, onChange } = props;

  const array = new Array(size).fill("-");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const elem = e.target;
    const val = e.target.value;
    if (!regex.test(val) && val !== "") return;

    const valueArr = value.split("");
    valueArr[index] = val;
    const newVal = valueArr.join("").slice(0, 6);
    onChange(newVal);

    if (val) {
      const next = elem.nextElementSibling as HTMLInputElement | null;
      next?.focus();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const current = e.currentTarget;
    if (e.key === "ArrowLeft" || e.key === "Backspace") {
      const prev = current.previousElementSibling as HTMLInputElement | null;
      prev?.focus();
      prev?.setSelectionRange(0, 1);
      return;
    }

    if (e.key === "ArrowRight") {
      const prev = current.nextSibling as HTMLInputElement | null;
      prev?.focus();
      prev?.setSelectionRange(0, 1);
      return;
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const val = e.clipboardData.getData("text").substring(0, size);
    onChange(val);
  };

  return (
    <div className="flex gap-2">
      {array.map((_, index) => {
        return (
          <input
            key={index}
            onChange={(e) => handleInputChange(e, index)}
            onKeyUp={handleKeyUp}
            onPaste={handlePaste}
            className="h-12 w-12 rounded-lg bg-neutral-700 text-center text-2xl shadow-md"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern={regex.source}
            maxLength={6}
            value={value.at(index) ?? ""}
          />
        );
      })}
    </div>
  );
};

export default OTPInput;
