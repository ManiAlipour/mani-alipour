import { RegisterInput } from "@/lib/validators/auth.validator";
import User from "@/models/User";
import { comparePassword, hashPassword } from "@/utils/bcrypt";
import { signJWT } from "@/utils/jwt";
import { generateOTP } from "@/utils/otp";

export async function loginService({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("ایمیل یا رمز عبور اشتباه است.");
  }
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("ایمیل یا رمز عبور اشتباه است.");
  }

  const token = signJWT({
    userId: user._id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}

export async function registerService(input: RegisterInput) {
  const existingUser = await User.findOne({ email: input.email });

  if (existingUser) {
    throw new Error(
      "این ایمیل قبلاً ثبت شده است. لطفاً با رمز دیگر وارد شوید یا ایمیل دیگری استفاده کنید.",
    );
  }

  const hashedPassword = await hashPassword(input.password);
  const otpCode = generateOTP();

  const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  const newUser = await User.create({
    name: input.name,
    email: input.email,
    password: hashedPassword,
    role: "user",
    otpCode,
    otpExpires,
  });

  return {
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      otpCode,
      otpExpires,
    },
  };
}
