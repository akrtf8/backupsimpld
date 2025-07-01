import React, { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  Eye as EyeIcon,
  EyeSlash as EyeSlashIcon,
} from "@phosphor-icons/react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as zod from "zod";

import authClient from "../../lib/auth/client";
import { useUser } from "../../hooks/use-user";
import { paths } from "../../paths";
import "../../styles/auth/sign-in-styles.css";

// Validation Schema
const schema = zod.object({
  email: zod.string().min(1, { message: "Email is required" }).email(),
  password: zod.string().min(1, { message: "Password is required" }),
  confirmPassword: zod
    .string()
    .min(1, { message: "Confirm password is required" })
    .refine((value, context) => value === context.parent.password, {
      message: "Passwords must match",
    }),
});

const defaultValues = { email: "", password: "", confirmPassword: "" };

export function ResetPasswordConfirm() {
  const navigate = useNavigate(); // React Router equivalent of Next.js useRouter
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

      const { error } = await authClient.resetPassword(values);

      if (error) {
        setError("root", { type: "server", message: error });
        setIsPending(false);
        return;
      }

      // Refresh the auth state
      await checkSession?.();

      // Redirect to login page or success page
      navigate(paths.auth.signIn, { replace: true });
    },
    [checkSession, navigate, setError]
  );

  return (
    <Stack
      spacing={6}
      sx={{
        padding: "3rem",
        borderRadius: "1px",
        margin: "2px",
        border: "1px solid ",
      }}
    >
      <Typography variant="h4">RESET PASSWORD</Typography>
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
          <Controller
            control={control}
            name="confirm-password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <Typography style={{ marginBottom: ".5rem" }}>
                  Confirm Password
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
                    mb: 3,
                  }}
                />
                {errors.password ? (
                  <FormHelperText>{errors.password.message}</FormHelperText>
                ) : null}
              </FormControl>
            )}
          />

          {errors.root && <Alert color="error">{errors.root.message}</Alert>}
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
            Save Password
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
