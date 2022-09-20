type AcceptableProperty = (string | Element | { [index: string]: string });
type ConstructorArgs = (AcceptableProperty | null)[];
type RepeatConstructor = (AcceptableProperty | number | string[] | null)[];