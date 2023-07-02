import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "firebase/config";
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
import OTPInput from "./OTPInput";

const PhoneAuth: React.FC = () => {
  const router = useRouter();
  const auth = getAuth(firebase_app);

  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [verificationId, setVerificationId] = useState<string>("");

  const [SMSdisabled, setSMSdisabled] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);
  const phoneRegex = /^(\+\d[\d\s-]*)$/;

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

  const startSMSTimer = () => {
    setSMSdisabled(true);
    startCountdown();
    setTimeout(() => {
      setSMSdisabled(false);
    }, 60000);
  };

  const startCountdown = () => {
    setCountdown(60);
    const countdownTimer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(countdownTimer);
          return 60;
        } else {
          return prevCountdown - 1;
        }
      });
    }, 1000);
  };

  const handleSendCode = () => {
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      toast.error("Please enter a valid phone number with Country Code (+)");
      setPhoneNumber("");
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
        startSMSTimer();
      })
      .catch((error) => {
        toast.error("Invalid phone number");
        console.log(error);
      });
  };

  const handleResendCode = () => {
    signInWithPhoneNumber(
      auth,
      phoneNumber,
      window.recaptchaVerifier as RecaptchaVerifier
    )
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        toast.success("Code resent to your phone SMS!");
        console.log("Code resent!");
        startSMSTimer();
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
      .then(async (result) => {
        console.log("Signed in with phone number!", result.user);

        if (result.user) {
          const userRef = doc(db, "users", result.user.uid);
          const userSnap = await getDoc(userRef);

          //if user doesn't exist, create user in db, redirect to welcome page
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              uid: result.user.uid,
              phoneNumber: result.user.phoneNumber,
              firstLogin: new Date().toISOString(),
            });
            toast.success("Registration successful!");
            void router.push("/welcome");
          } else {
            //if user exists, redirect to home page
            toast.success(`Welcome back ${result.user.displayName!}!`);
            void router.push("/");
          }
        }
      })
      .catch((error) => {
        toast.error("Invalid code");
        console.log(error);
      });
  };

  return (
    <div>
      <div className="container flex flex-col items-center justify-center rounded-3xl bg-neutral-800 px-4 py-16 font-medium shadow-md shadow-neutral-900">
        {verificationId ? (
          <>
            {/* OTP INPUT */}
            {/* <input
              className="m-4 rounded-lg bg-neutral-700 p-2 text-center text-xl"
              type="text"
              onChange={(e) => setCode(e.target.value)}
              value={code}
            /> */}
            <div className="m-8 text-xl">Enter OTP</div>
            <OTPInput value={code} onChange={(e) => setCode(e)} />
            <button
              className="m-8 mb-4 rounded-lg bg-blue-600 px-12 py-2 shadow-md active:bg-blue-800"
              onClick={handleVerifyCode}
            >
              Verify
            </button>
            <button
              disabled={SMSdisabled}
              className="m-2 mb-0 px-2 py-2 text-xs font-normal text-neutral-400 underline"
              onClick={() => handleResendCode()}
            >
              Resend OTP Code {SMSdisabled ? `(in ${countdown} seconds)` : ""}
            </button>
            <button
              className="m-2 px-2 py-2 text-xs font-normal text-neutral-400 underline"
              onClick={() => setVerificationId("")}
            >
              Or choose a different phone number
            </button>
          </>
        ) : (
          <>
            {/* PHONE NUMBER INPUT*/}
            <div className="m-8 text-xl">Enter Phone Number</div>
            <input
              type="tel"
              className="m-8 rounded-lg bg-neutral-700 p-2 text-center text-xl shadow-md"
              onChange={(e) => setPhoneNumber(e.target.value)}
              pattern={phoneRegex.toString()}
              value={phoneNumber}
            />
            <button
              disabled={SMSdisabled}
              className="m-8 mb-2 rounded-lg bg-blue-600 px-12 py-2 shadow-md active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
              id="sign-in-button"
              onClick={handleSendCode}
            >
              Submit
            </button>
            <div className="text-xs font-normal text-neutral-400 underline">
              {SMSdisabled ? `(Please wait ${countdown} seconds)` : ""}
            </div>
          </>
        )}

        {/* to be added later */}

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default PhoneAuth;
