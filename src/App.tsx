import { Box, Slider, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { LongPressButton } from "./LongPressButton";

type CounterProps = {
    count: number;
    setCount: (num: number) => void;
    total: number;
    width: number;
};

const Counter = (props: CounterProps) => {
    const { count, setCount, total, width } = props;
    return (
        <Box
            onClick={() => {
                setCount(count + 1);
            }}
            sx={{
                cursor: "pointer",
                padding: 2,
                border: "2px solid #8ebfbb",
                borderRadius: 2,
                margin: 1,
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
                width: width,
            }}
        >
            <Typography>{count}</Typography>
            <Typography sx={{ fontSize: 12, color: "#53706e" }}>
                {Math.round(total === 0 ? 0 : (count / total) * 100)}%
            </Typography>
        </Box>
    );
};

function App() {
    const [count, setCount] = useState([0, 0, 0, 0]);
    const [width, setWidth] = useState(
        JSON.parse(localStorage.getItem("button_width") || "60")
    );
    const totalCount = count.reduce((acc, c) => acc + c, 0);

    const handleSliderChange = (event: Event, newValue: number) => {
        setWidth(newValue);
        localStorage.setItem("button_width", JSON.stringify(newValue));
    };

    return (
        <Box sx={{ backgroundColor: "#a4dbd7", height: "100vh" }}>
            <Typography align="center" sx={{}}>
                Cell Counter
            </Typography>
            <Typography align="center" sx={{}}>
                Total: {totalCount}
            </Typography>
            <Stack
                direction="row"
                height={"40vh"}
                spacing={1}
                sx={{
                    padding: 2,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                {count.map((c, index) => (
                    <Counter
                        key={index}
                        count={c}
                        setCount={(num) => {
                            const newCount = [...count];
                            newCount[index] = num;
                            setCount(newCount);
                        }}
                        total={totalCount}
                        width={width}
                    />
                ))}
            </Stack>
            <Box sx={{ p: 2 }}>
                <LongPressButton onLongPress={() => setCount([0, 0, 0, 0])}>
                    Reset
                </LongPressButton>
            </Box>
            <Slider value={width} onChange={handleSliderChange} min={40} />
        </Box>
    );
}

export default App;
