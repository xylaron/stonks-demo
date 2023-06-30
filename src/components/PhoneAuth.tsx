import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import firebase_app from "firebase/config";
import toast from "react-hot-toast";

const PhoneAuth: React.FC = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [verificationId, setVerificationId] = useState<string>("");
  const auth = getAuth(firebase_app);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
        },
        auth
      );
    }
    //eslint-disable-next-line
    window.recaptchaVerifier.render().then((widgetId: number) => {
      window.recaptchaWidgetId = widgetId;
    });
  });

  const handleSendCode = () => {
    if (!phoneNumber) {
      toast.error("Please enter a valid phone number");
      return;
    }

    signInWithPhoneNumber(
      auth,
      phoneNumber,
      window.recaptchaVerifier as RecaptchaVerifier
    )
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        toast.success("Code sent to your phone SMS!");
        console.log("Code sent!");
      })
      .catch((error) => {
        toast.error("Invalid phone number");
        console.log(error);
      });
  };

  const handleVerifyCode = () => {
    if (!code) {
      toast.error("Please enter a valid phone number");
      return;
    }
    const credential = PhoneAuthProvider.credential(verificationId, code);

    signInWithCredential(auth, credential)
      .then((result) => {
        console.log("Signed in with phone number!", result.user);
        void router.push("/");
      })
      .catch((error) => {
        toast.error("Invalid code");
        console.log(error);
      });
  };

  return (
    <div>
      <div className="container flex flex-col items-center justify-center px-4 py-16 font-medium">
        {verificationId ? (
          <>
            {/* OTP INPUT */}
            <input
              className="m-4 rounded-lg bg-neutral-700 p-2 text-center text-xl"
              type="text"
              onChange={(e) => setCode(e.target.value)}
              value={code}
            />
            <button
              className="m-4 mb-2 rounded-lg bg-blue-600 px-12 py-2  active:bg-blue-800"
              onClick={handleVerifyCode}
            >
              Verify
            </button>
            <button
              className="rounded-lg px-4 py-2 text-xs font-normal text-neutral-500 underline"
              onClick={() => setVerificationId("")}
            >
              Or choose a different phone number
            </button>
          </>
        ) : (
          <>
            {/* PHONE NUMBER INPUT*/}
            <input
              type="tel"
              className="m-4 rounded-lg bg-neutral-700 p-2 text-center text-xl"
              onChange={(e) => setPhoneNumber(e.target.value)}
              value={phoneNumber}
            />
            <button
              className="active: m-4 rounded-lg bg-blue-600 px-12 py-2 active:bg-blue-800"
              id="sign-in-button"
              onClick={handleSendCode}
            >
              Submit
            </button>
          </>
        )}

        {/* to be added later */}

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default PhoneAuth;
