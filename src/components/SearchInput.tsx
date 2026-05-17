type Props = {
  value: string;
  onInput: (value: string) => void;
};

export default function SearchInput({ value, onInput }: Props) {
  return (
    <input
      class="search-input"
      type="search"
      name="q"
      value={value}
      placeholder="Search title, company, tag"
      aria-label="Search jobs"
      onInput={(event) => onInput((event.currentTarget as HTMLInputElement).value)}
    />
  );
}
