import { useState } from "react";
import { useRouter } from "next/router";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import firebase_app from "firebase/config";

const PhoneAuth: React.FC = () => {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [verificationId, setVerificationId] = useState<string>("");

  const auth = getAuth(firebase_app);

  const handleSendCode = () => {
    const recaptchaVerifier = new RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
      },
      auth
    );

    signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleVerifyCode = () => {
    const credential = PhoneAuthProvider.credential(verificationId, code);

    signInWithCredential(auth, credential)
      .then((result) => {
        console.log("Signed in with phone number!", result.user);
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16">
      <input
        type="tel"
        className="p-1"
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <button
        className="rounded-md bg-white px-2 py-1 font-bold"
        id="sign-in-button"
        onClick={handleSendCode}
      >
        Send Code
      </button>
      <input
        className="mt-8 p-1"
        type="text"
        onChange={(e) => setCode(e.target.value)}
      />
      <button
        className="rounded-md bg-white px-2 py-1 font-bold"
        onClick={handleVerifyCode}
      >
        Verify Code
      </button>
    </div>
  );
};

export default PhoneAuth;
