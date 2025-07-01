"use client";

import React, { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  Eye as EyeIcon,
  EyeSlash as EyeSlashIcon,
} from "@phosphor-icons/react";
import { Controller, useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import * as zod from "zod";

import { useUser } from "../../hooks/use-user";
import authClient from "../../lib/auth/client";
import { paths } from "../../paths";

import "../../styles/auth/sign-in-styles.css";

const schema = zod.object({
  email: zod.string().min(1, { message: "Email is required" }),
  password: zod.string().min(1, { message: "Password is required" }),
});

const defaultValues = { email: "", password: "" };

export function SignInForm() {
  const navigate = useNavigate();
  const { checkSession } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = useCallback(
    async (values) => {
      setIsPending(true);

      const { error } = await authClient.signInWithPassword(values);

      if (error) {
        setError("root", { type: "server", message: error });
        setIsPending(false);
        return;
      }

      // Refresh the auth state
      await checkSession?.();

      

      // Redirect to the dashboard
      navigate(0);
      // navigate(paths.dashboard.home, { redirect: true });
      // window.location.reload(true);
    },
    [checkSession, navigate, setError]
  );

  return (
    <Stack
      className="login-main"
      spacing={6}
      sx={{
        padding: "3rem",
        borderRadius: "5px",
        margin: "2px",
        border: "1px solid",
      }}
    >
      <Stack spacing={1}>
        <Typography className="header">ADMIN LOGIN</Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <Typography style={{ marginBottom: ".5rem" }}>Email</Typography>
                <OutlinedInput
                  {...field}
                  type="text"
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.822)",
                    color: "black",
                  }}
                />
                {errors.email ? (
                  <FormHelperText>{errors.email.message}</FormHelperText>
                ) : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <Typography style={{ marginBottom: ".5rem" }}>
                  Password
                </Typography>
                <OutlinedInput
                  {...field}
                  type={showPassword ? "text" : "password"}
                  // endAdornment={
                  //   showPassword ? (
                  //     <EyeIcon
                  //       cursor="pointer"
                  //       fontSize="var(--icon-fontSize-md)"
                  //       onClick={() => setShowPassword(false)}
                  //     />
                  //   ) : (
                  //     <EyeSlashIcon
                  //       cursor="pointer"
                  //       fontSize="var(--icon-fontSize-md)"
                  //       onClick={() => setShowPassword(true)}
                  //     />
                  //   )
                  // }
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.822)",
                    color: "black",
                  }}
                />
                {errors.password ? (
                  <FormHelperText>{errors.password.message}</FormHelperText>
                ) : null}
              </FormControl>
            )}
          />
          <div style={{ textAlign: "end" }} className="sign-forg-msg">
            <RouterLink
              to={paths.auth.resetPassword}
              style={{ color: "white", textDecoration: "none" }}
            >
              Forgot password?
            </RouterLink>
          </div>
          {errors.root ? (
            <Alert color="error">{errors.root.message}</Alert>
          ) : null}
          <Button
            disabled={isPending}
            type="submit"
            variant="contained"
            sx={{
              fontWeight: "bold",
              backgroundColor: "white",
              color: "black",
              fontSize: "1rem",
            }}
            className="LoginButton"
          >
            Login
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
