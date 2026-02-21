"use client";

import { Button } from "@/components/ui/button";

type ConfirmSubmitButtonProps = {
  children: React.ReactNode;
  confirmMessage: string;
};

export function ConfirmSubmitButton({
  children,
  confirmMessage,
}: ConfirmSubmitButtonProps) {
  return (
    <Button
      type="submit"
      size="sm"
      variant="outline"
      onClick={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </Button>
  );
}
