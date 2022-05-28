import { Switch as SwitchComponent } from "antd";

import { Container } from "./styles";

interface SwitchProps {
  leftText?: string;
  rightText?: string;
  checked?: boolean;
  onChange?: any;
  disabled?: boolean;
}

export default function Switch({
  leftText,
  rightText,
  checked,
  onChange ,
  disabled,
}: SwitchProps) {
  return (
    <Container>
      <span className="first">{leftText}</span>
      <SwitchComponent
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className="second">{rightText}</span>
    </Container>
  );
}
