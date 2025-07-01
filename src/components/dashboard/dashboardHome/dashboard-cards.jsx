import * as React from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ArrowDown as ArrowDownIcon } from "@phosphor-icons/react/dist/ssr/ArrowDown";
import { ArrowUp as ArrowUpIcon } from "@phosphor-icons/react/dist/ssr/ArrowUp";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import "../../../styles/customstyles.css";
import { Icon } from "@phosphor-icons/react";

export function DashboardCards({
  diff,
  cardheading,
  trend,
  sx,
  value,
  Icon,
  path = "",
}) {
  const navigate = useNavigate();
  const TrendIcon = trend === "up" ? ArrowUpIcon : ArrowDownIcon;
  const trendColor =
    trend === "up"
      ? "var(--mui-palette-success-main)"
      : "var(--mui-palette-error-main)";

  const onClickRedirect = (path) => {
    navigate(`/dashboard/clinics?statusFilter=${path}`);
  };

  return (
    <Card sx={sx}>
      <CardContent className="homePageCardMain">
        <Stack spacing={2}>
          <Stack
            direction="row"
            sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
            spacing={2}
          >
            <Avatar
              sx={{ height: "66px", width: "66px", borderRadius: "16px" }}
              className="brand-color-bg-light"
            >
              <Icon
                fontSize="var(--icon-fontSize-lg)"
                className="brand-color-text"
              />
            </Avatar>
            <Stack
              spacing={1}
              sx={{ alignItems: "end", justifyContent: "center" }}
            >
              <Typography
                color="text.secondary"
                className="dashboard-card-title-main"
              >
                {cardheading}
              </Typography>
              <Typography className="dashboard-card-value-main" variant="h4">
                {value}
              </Typography>
            </Stack>
          </Stack>
          {diff ? (
            <Stack
              sx={{
                alignItems: "center",
                color: "var(--mui-palette-primary-main)",
                padding: "1rem 0",
                cursor: "pointer",
              }}
              direction="row"
              spacing={1}
              onClick={() => {
                onClickRedirect(path);
              }}
            >
              <Typography className="brand-color-text" variant="overline">
                View Data
              </Typography>
              <ArrowRightIcon
                fontSize="var(--icon-fontSize-md)"
                className="brand-color-text"
              />
            </Stack>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
