import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { authToken, getUserDetailsForLogin, login, restPassowrdFunc, sendOtpFunc, verifyOtpFunc } from "../../redux/_reducers/_auth_reducers";
import OTPInput from "react-otp-input";
import { FaEye, FaArrowLeft, FaShuttleVan } from "react-icons/fa";
import { BsEyeSlashFill } from "react-icons/bs";
import { AiOutlineCaretRight } from "react-icons/ai";
import { Radio } from "antd";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [screen, setScreen] = useState("login");
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const { login_loading, userDataForLogin } = useSelector((state) => state.authentication);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [userError, setUserError] = useState("")
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [timer, setTimer] = useState(120);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [directorEmail, setDirectorEmail] = useState('');

  const handleDirectorEmailChange = (email) => {
    setDirectorEmail(email.target.value);
  }
  const [selectedValueDirectorRadio, setSelectedValueDirectorRadio] = useState(null);
  const [userDetailsInDirectorLogin, setUserDetailsInDirectorLogin] = useState(null);

  const handleRadioChange = (e) => {
    const selectedIndex = e.target.value;
    const selectedUser = userDataForLogin?.userinfo?.data[selectedIndex];
    setSelectedValueDirectorRadio(selectedIndex);
    setUserDetailsInDirectorLogin(selectedUser);
  };

  useEffect(() => {
    setUserDetailsInDirectorLogin(null)
    setSelectedValueDirectorRadio(null)
    if (directorEmail === '') return;

    const handler = setTimeout(() => {
      dispatch(getUserDetailsForLogin({
        "email": directorEmail
      }))
    }, 1000);
    return () => {
      clearTimeout(handler);
    };
  }, [directorEmail]);

  useEffect(() => {
    setDirectorEmail('')
    setUserDetailsInDirectorLogin(null)
    setSelectedValueDirectorRadio(null)
  }, [screen]);

  const { token } = useParams()

  useEffect(() => {
    const login = localStorage.getItem("token");
    if (login) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    setUsernameError("");
    setPasswordError("");
    let isValid = true;

    if (!username) {
      setUsernameError("Enter your username.");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Enter your password.");
      isValid = false;
    }

    if (!isValid) return;

    const reqData = screen === "directorLogin" ? {
      email: directorEmail,
      password,
      loginBy: directorEmail ? userDetailsInDirectorLogin : null
    } : {
      email: username,
      password,
    };

    dispatch(login(reqData)).then((response) => {
      if (response && response?.payload) {
        setUsernameError("");
        setPasswordError("");
        setUserDetailsInDirectorLogin(null)
        setSelectedValueDirectorRadio(null)
        setDirectorEmail('')
        window.location.href = "/admin/dashboard";
      }
    });
  };

  const handleUserNameChange = (e) => {
    setUsername(e.target.value);
    if (e.target.value) {
      setUsernameError("");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value) {
      setPasswordError("");
    }
  };

  const handleForgotPassword = () => {
    setScreen('forgotPassword');
  };

  const handleGoBack = () => {
    setScreen('login');
    setEmail("");
    setUserName("");
    setOtp("");
    setOtpSent(false);
    setOtpError("");
    setUserError("")
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email && !userName) {
      setOtpError("Please enter your email address.");
      setUserError("Please enter your username .");
    }
    if (!email) {
      setOtpError("Please enter your email address.");
      return;
    }
    if (!userName) {
      setUserError("Please enter your username .");
      return;
    }

    dispatch(sendOtpFunc({
      "email": email,
      userName: userName,
      "type": "forgotPassword"
    })).then(data => {
      if (!data.error) {
        setScreen('otp');
        setOtpSent(true);
        setOtpError("");
      }
    })
  };

  useEffect(() => {
    if (timer > 0) {
      if (screen === "otp") {
        setIsResendEnabled(false);
        const interval = setInterval(() => {
          setTimer(prevTimer => prevTimer - 1);
        }, 1000);
        return () => clearInterval(interval);
      }
    } else {
      setIsResendEnabled(true);
    }
  }, [timer, screen]);

  useEffect(() => {
    if (token) {
      dispatch(authToken({
        authToken: token
      })).then((response) => {
        if (response && response?.payload?.userinfo) {
          navigate("/admin/dashboard");
        }
      });
    }
  }, [token])

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp) {
      dispatch(verifyOtpFunc({
        "email": email,
        userName: userName,
        "otp": +otp
      })).then(data => {
        if (!data.error) {
          setScreen('resetPassword');
        }
      })
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleResendOTP = () => {
    if (!email) {
      setOtpError("Please enter your email address.");
      return;
    }
    dispatch(sendOtpFunc({
      "email": email,
      userName: userName,
      "type": "forgotPassword"
    })).then(data => {
      if (!data.error) {
        setScreen('otp');
        setOtpSent(true);
        setOtpError("");
        setTimer(120);
      }
    })
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    setNewPasswordError("");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError("");
  };

  const validateForm = () => {
    let valid = true;
    setNewPasswordError("");
    setConfirmPasswordError("");
    if (confirmPassword !== newPassword) {
      setConfirmPasswordError("Passwords do not match.");
      valid = false;
    }

    return valid;
  };

  const handleSubmitRestPaswword = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setResetPasswordLoading(true);

    dispatch(restPassowrdFunc({
      "email": email,
      userName: userName,
      "password": confirmPassword
    })).then(data => {
      if (!data.error) {
        setResetPasswordLoading(false);
        setScreen('login');
      }
    })
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  if (token) {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-dvh bg-gradient-to-br from-teal-50 via-white to-cyan-50 relative overflow-hidden" style={{
        backgroundImage: "url('/loginback.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
      >
        {/* Dark Overlay for Better Readability */}
        {/* <div className="absolute inset-0 bg-black bg-opacity-40"></div> */}
        <div className="absolute top-10 left-10 opacity-10">
          <FaShuttleVan className="text-header text-6xl transform -rotate-12" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-10">
          <FaShuttleVan className="text-header text-8xl transform rotate-12" />
        </div>
        <div className="absolute top-1/3 right-1/4 opacity-5">
          <FaShuttleVan className="text-header text-9xl" />
        </div>

        <div className="w-full max-w-lg mx-4 relative z-10">
          {/* Header Section with Nexus Theme */}
          <div className="text-center mb-8">
            <p className="text-gray-700 text-sm font-medium">
              Welcome to the Future of Office Management
            </p>
            <h1 className="text-4xl font-bold text-header mb-2 tracking-tight">
              OFFICE NEXUS
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-header to-teal-400 mx-auto mb-3 rounded-full"></div>
            <p className="text-gray-600 text-sm font-medium">
              Streamlined Business Operations
            </p>
          </div>

          {/* Login Card with Nexus-inspired Design */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-teal-100 relative overflow-hidden">
            {/* Accent Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-header to-teal-400"></div>
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-header rounded-full opacity-5"></div>
            <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-teal-400 rounded-full opacity-5"></div>



            {/* Login Screen */}
            {screen === "login" && (
              <form autoComplete="off" onSubmit={handleSubmit}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FaShuttleVan className="text-header text-lg" />
                    Welcome Back
                  </h2>
                  <button
                    type="button"
                    onClick={() => setScreen("directorLogin")}
                    className="text-header text-sm font-semibold hover:underline flex items-center gap-1"
                  >
                    Director Access <AiOutlineCaretRight />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                      Username or Email
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-header focus:border-transparent transition-all duration-300 bg-gray-50"
                      id="username"
                      placeholder="Enter your credentials"
                      value={username}
                      onChange={handleUserNameChange}
                    />
                    {usernameError && <div className="text-red-500 text-xs mt-2 flex items-center gap-1">{usernameError}</div>}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={passwordVisible ? "text" : "password"}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-header focus:border-transparent transition-all duration-300 bg-gray-50 pr-12"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-header transition-colors"
                      >
                        {!passwordVisible ? <FaEye size={18} /> : <BsEyeSlashFill size={18} />}
                      </button>
                    </div>
                    {passwordError && <div className="text-red-500 text-xs mt-2 flex items-center gap-1">{passwordError}</div>}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6 mb-6">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-header text-sm font-semibold hover:underline flex items-center gap-1"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={login_loading}
                  className="w-full bg-gradient-to-r from-header to-teal-600 text-white py-2 px-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {login_loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Boarding...
                    </div>
                  ) : (
                    "Login to Nexus"
                  )}
                </button>
              </form>
            )}

            {/* Director Login Screen */}
            {screen === "directorLogin" && (
              <form autoComplete="off" onSubmit={handleSubmit}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FaShuttleVan className="text-header text-lg" />
                    Executive Access
                  </h2>
                  <button
                    type="button"
                    onClick={() => setScreen("login")}
                    className="text-header text-sm font-semibold hover:underline flex items-center gap-1"
                  >
                    General Login <AiOutlineCaretRight />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Corporate Email
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-header focus:border-transparent transition-all duration-300 bg-gray-50"
                      id="email"
                      placeholder="Enter corporate email"
                      value={directorEmail}
                      onChange={handleDirectorEmailChange}
                    />
                    {usernameError && <div className="text-red-500 text-xs mt-2">{usernameError}</div>}
                  </div>

                  {userDataForLogin?.userinfo?.data && directorEmail && (
                    <div className="border-2 border-teal-100 rounded-xl p-4 bg-gradient-to-r from-teal-50 to-white">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Select Access Level:
                      </label>
                      <Radio.Group onChange={handleRadioChange} value={selectedValueDirectorRadio}>
                        <div className="space-y-3">
                          {userDataForLogin.userinfo.data
                            .filter(user => !(user.userType === "companyBranch" && !user.isDirectorToBranch))
                            .map((user, index) => (
                              <div key={index} className="flex items-center p-2 hover:bg-teal-50 rounded-lg transition-colors">
                                <Radio value={index} className="[&>.ant-radio-checked>.ant-radio-inner]:bg-header">
                                  <span className="text-sm font-medium">
                                    {user.userType === 'companyDirector' ? '🏢 Director Dashboard' : '🏬 Branch Management'}
                                  </span>
                                </Radio>
                              </div>
                            ))
                          }
                        </div>
                      </Radio.Group>
                    </div>
                  )}

                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Security Key
                    </label>
                    <div className="relative">
                      <input
                        type={passwordVisible ? "text" : "password"}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-header focus:border-transparent transition-all duration-300 bg-gray-50 pr-12"
                        id="password"
                        placeholder="Enter security key"
                        value={password}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-header transition-colors"
                      >
                        {!passwordVisible ? <FaEye size={18} /> : <BsEyeSlashFill size={18} />}
                      </button>
                    </div>
                    {passwordError && <div className="text-red-500 text-xs mt-2">{passwordError}</div>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={login_loading}
                  className="w-full bg-gradient-to-r from-header to-teal-600 text-white py-2 px-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
                >
                  {login_loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Accessing...
                    </div>
                  ) : (
                    "Executive Login"
                  )}
                </button>
              </form>
            )}

            {/* Forgot Password Screen */}
            {screen === "forgotPassword" && (
              <form autoComplete="off" onSubmit={handleEmailSubmit}>
                <div className="flex items-center gap-3 mb-6">
                  <button
                    type="button"
                    onClick={handleGoBack}
                    className="p-2 hover:bg-teal-50 rounded-lg transition-colors"
                  >
                    <FaArrowLeft className="text-header" />
                  </button>
                  <h2 className="text-2xl font-bold text-gray-800">Identity Verification</h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Registered Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-header focus:border-transparent transition-all duration-300 bg-gray-50"
                      id="email"
                      placeholder="Enter registered email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setOtpError("")
                      }}
                    />
                    {otpError && <div className="text-red-500 text-xs mt-2">{otpError}</div>}
                  </div>

                  <div>
                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-header focus:border-transparent transition-all duration-300 bg-gray-50"
                      id="username"
                      placeholder="Enter your username"
                      value={userName}
                      onChange={(e) => {
                        setUserName(e.target.value)
                        setUserError("")
                      }}
                    />
                    {userError && <div className="text-red-500 text-xs mt-2">{userError}</div>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={login_loading}
                  className="w-full bg-gradient-to-r from-header to-teal-600 text-white py-2 px-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
                >
                  Send Verification Code
                </button>
              </form>
            )}

            {/* OTP Verification Screen */}
            {screen === "otp" && (
              <form autoComplete="off" onSubmit={handleOtpSubmit}>
                <div className="flex items-center gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => { setScreen('forgotPassword'); setOtpSent(false); setOtp(""); setTimer(120) }}
                    className="p-2 hover:bg-teal-50 rounded-lg transition-colors"
                  >
                    <FaArrowLeft className="text-header" />
                  </button>
                  <h2 className="text-2xl font-bold text-gray-800">Security Code</h2>
                </div>

                <div className="space-y-5">
                  <div className="text-center">
                    <p className="text-gray-600 mb-6">Enter the 6-digit code sent to your email</p>

                    <div className="flex justify-center mb-6">
                      <OTPInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderInput={(props) => <input {...props} />}
                        inputStyle={{
                          width: '50px',
                          height: '50px',
                          margin: '0 8px',
                          borderRadius: '12px',
                          border: '2px solid #e5e7eb',
                          fontSize: '18px',
                          fontWeight: '600',
                          backgroundColor: '#f9fafb',
                          transition: 'all 0.3s',
                        }}
                        containerStyle="justify-center"
                      />
                    </div>

                    {otpError && <div className="text-red-500 text-xs text-center mb-4">{otpError}</div>}

                    <div className="text-center space-y-3">
                      <div className="text-sm text-gray-600">
                        Code expires in: <span className="font-bold text-header">{formatTime(timer)}</span>
                      </div>
                      {isResendEnabled && (
                        <button
                          type="button"
                          className="text-header font-semibold hover:underline text-sm"
                          onClick={handleResendOTP}
                        >
                          Resend Security Code
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={login_loading || otp.length !== 6}
                  className="w-full bg-gradient-to-r from-header to-teal-600 text-white py-2 px-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
                >
                  Verify & Continue
                </button>
              </form>
            )}

            {/* Reset Password Screen */}
            {screen === "resetPassword" && (
              <form autoComplete="off" onSubmit={handleSubmitRestPaswword}>
                <div className="flex items-center gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => { setScreen('otp'); setNewPassword(""); setConfirmPassword(""); }}
                    className="p-2 hover:bg-teal-50 rounded-lg transition-colors"
                  >
                    <FaArrowLeft className="text-header" />
                  </button>
                  <h2 className="text-2xl font-bold text-gray-800">New Security Key</h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      New Security Key
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-header focus:border-transparent transition-all duration-300 bg-gray-50"
                      id="newPassword"
                      placeholder="Create new security key"
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                    />
                    {newPasswordError && <div className="text-red-500 text-xs mt-2">{newPasswordError}</div>}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Security Key
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-header focus:border-transparent transition-all duration-300 bg-gray-50"
                      id="confirmPassword"
                      placeholder="Confirm security key"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                    />
                    {confirmPasswordError && <div className="text-red-500 text-xs mt-2">{confirmPasswordError}</div>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resetPasswordLoading}
                  className="w-full bg-gradient-to-r from-header to-teal-600 text-white py-2 px-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
                >
                  {resetPasswordLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </div>
                  ) : (
                    "Update Security Key"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => { setScreen('login'); setNewPassword(""); setConfirmPassword(""); setOtpSent(false); setOtp(""); setTimer(120) }}
                  className="w-full text-header py-3 px-4 rounded-xl font-semibold hover:bg-teal-50 transition-colors duration-200 mt-4 flex items-center justify-center gap-2"
                >
                  Back to Login <AiOutlineCaretRight />
                </button>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">
              Secure Business Portal • OFFICE NEXUS
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;