import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";

const CustomSwitch = styled(Switch)(({ theme }) => ({
  width: 65,
  height: 34,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(32px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#4CAF50",
        opacity: 1,
        border: 0,
        "&:before": {
          opacity: 1,
        },
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 30,
    height: 30,
    color: "#fff",
  },
  "& .MuiSwitch-track": {
    borderRadius: 34,
    backgroundColor: "#ff4032",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
    "&:before": {
      content: '"Yes"',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      left: "8px",
      color: "#fff",
      fontSize: 14,
      fontWeight: 500,
      opacity: 0,
      transition: "opacity 300ms",
    },
  },
}));

export default CustomSwitch;
