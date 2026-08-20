import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, LoaderCircle, X } from "lucide-react";
import {
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

type ButtonProps = Omit<
  ComponentPropsWithoutRef<typeof motion.button>,
  "children"
> & {
  variant?: "primary" | "ghost" | "danger";
  loading?: boolean;
  children?: ReactNode;
};
export function Button({
  variant = "primary",
  loading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const styles = {
    primary: "bg-cyan text-midnight hover:bg-white hover:shadow-glowStrong",
    ghost:
      "border border-border bg-white/[0.03] text-white hover:border-cyan/40 hover:bg-cyan/10 hover:shadow-glow",
    danger: "bg-red-500/15 text-red-300 hover:bg-red-500/25",
  };
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={cn(
        "interactive inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50",
        styles[variant],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoaderCircle size={16} className="animate-spin" />}
      {children}
    </motion.button>
  );
}

export function IconButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "interactive grid size-9 place-items-center rounded-lg text-textMuted hover:bg-cyan/10 hover:text-cyan hover:shadow-glow",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "panel transition-all duration-200",
        onClick && "cursor-pointer hover:border-cyan/30 hover:shadow-glow",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-[#050710]/80 p-6 backdrop-blur-md"
          onMouseDown={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            onMouseDown={(event) => event.stopPropagation()}
            className={cn(
              "relative max-h-[92vh] w-full max-w-xl overflow-auto rounded-2xl border border-white/10 bg-midnight-900 p-7 shadow-2xl",
              className,
            )}
          >
            <IconButton
              aria-label="Fechar modal"
              onClick={onClose}
              className="absolute right-4 top-4"
            >
              <X size={18} />
            </IconButton>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  className,
}: {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  className?: string;
}) {
  return (
    <input
      aria-label="Controle deslizante"
      type="range"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(event) => onChange(Number(event.target.value))}
      className={cn(
        "interactive h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-cyan",
        className,
      )}
    />
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="interactive inline-flex items-center gap-3"
      role="switch"
      aria-checked={checked}
    >
      <span
        className={cn(
          "relative h-5 w-9 rounded-full border transition-all duration-200",
          checked
            ? "border-cyan bg-cyan/25 shadow-glow"
            : "border-white/10 bg-white/10",
        )}
      >
        <motion.span
          animate={{ x: checked ? 17 : 2 }}
          className={cn(
            "absolute top-[2px] size-3.5 rounded-full",
            checked ? "bg-cyan" : "bg-textMuted",
          )}
        />
      </span>
      {label && <span className="text-sm text-white">{label}</span>}
    </button>
  );
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
}: {
  items: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex rounded-lg border border-border bg-midnight p-1">
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => onChange(item.value)}
          className={cn(
            "interactive relative flex-1 rounded-md px-3 py-2 text-xs font-semibold",
            value === item.value
              ? "text-midnight"
              : "text-textMuted hover:text-white",
          )}
        >
          {value === item.value && (
            <motion.span
              layoutId="tab-active"
              className="absolute inset-0 rounded-md bg-cyan"
            />
          )}
          <span className="relative">{item.label}</span>
        </button>
      ))}
    </div>
  );
}

export function Dropdown({
  value,
  options,
  onChange,
  className,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, []);
  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="interactive flex h-10 w-full items-center justify-between rounded-lg border border-border bg-white/[0.03] px-3 text-sm hover:border-cyan/40"
      >
        <span>{value}</span>
        <ChevronDown
          size={15}
          className={cn("transition-transform", open && "rotate-180")}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 4 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute z-30 w-full overflow-hidden rounded-lg border border-white/10 bg-midnight-700 p-1 shadow-2xl"
          >
            {options.map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className="interactive flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-cyan/10 hover:text-cyan"
              >
                {option}
                {option === value && <Check size={14} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative grid size-8 place-items-center rounded-lg bg-cyan text-midnight shadow-glow">
        <span className="text-base font-black italic">C</span>
        <span className="absolute -right-1 -top-1 size-2 rounded-full bg-white" />
      </div>
      {!compact && (
        <span className="text-[17px] font-bold tracking-tight">
          ClipForge<span className="text-cyan">.</span>
        </span>
      )}
    </div>
  );
}

export function Spinner() {
  return <LoaderCircle className="animate-spin text-cyan" size={18} />;
}
export { cn };
