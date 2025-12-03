"use client";

export type BadgeProps = {
    text: string;
    color: string;
};

const colorPairs: {[key: string]: {bg: string, text: string}} = {
    "orange": {bg: "#F8E6BA", text: "#402C1B"},
    "yellow": {bg: "#FFF7E6", text: "#482602"},
    "blue": {bg: "#D5E7F2", text: "#193347"},
    "green": {bg: "#DCEBDD", text: "#1D3829"},
    "red": {bg: "#FBDED9", text: "#5D1615"},
    "gray": {bg: "#F2F2F2", text: "#383838"},
    "purple": {bg: "#E2D8E8", text: "#412454"},
    "pink": {bg: "#F8DFEB", text: "#4C2337"},
}

export function Badge(props: BadgeProps) {
    return (
        <span
            style={{
                backgroundColor: colorPairs[props.color].bg,
                color: colorPairs[props.color].text,
            }}
            className="px-2.5 py-1 rounded-xs"
        >
            {props.text}
        </span>
    );
}
