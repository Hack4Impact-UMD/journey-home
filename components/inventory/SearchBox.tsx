import { SearchIcon } from "../icons/SearchIcon";

type SearchBoxProps = {
    value: string;
    onChange: React.Dispatch<React.SetStateAction<string>>;
    onSubmit: () => void;
};

export function SearchBox({ value, onChange, onSubmit }: SearchBoxProps) {
    return (
        <>
            <div className="border border-light-border rounded-xs flex w-full">
                <form
                    className="flex w-full"
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit();
                    }}
                >
                    <input
                        type="text"
                        className="flex-1 min-w-0 h-8 text-sm text-text-1 placeholder:text-[#BFBFBF] px-3 outline-none"
                        placeholder="Search"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="h-8 w-8 border-l border-light-border flex items-center justify-center"
                    >
                        <SearchIcon />
                    </button>
                </form>
            </div>
        </>
    );
}
