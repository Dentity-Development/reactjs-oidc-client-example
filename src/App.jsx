import axios from "axios";
import queryString from "query-string";
import { useEffect, useState } from "react";
import "./App.css";
import AuthImage from "./images/index";
import JsonFormatter from "react-json-formatter";

function App() {
  const [client, setClient] = useState({
    client_id: "",
    client_secret: "",
    scope: "openid profile",
    response_type: "code",
    redirect_uri: "",
    authority: "https://oidc.dentity.com/oidc",
  });

  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    handleGetIdToken();
  }, []);

  const stringifiedParams = queryString.stringify({
    client_id: client.client_id,
    scope: client.scope,
    response_type: client.response_type,
    redirect_uri: client.redirect_uri,
  });
  const authLink = `${client.authority}/auth?${stringifiedParams}`;
  const logoutLink = `${client.authority}/remove-session`;

  const handleGetIdToken = async () => {
    const { code } = queryString.parse(window.location.search);
    if (code) {
      const response = await axios({
        method: "post",
        url: `${client.authority}/token`,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: queryString.stringify({
          client_id: client.client_id,
          client_secret: client.client_secret,
          redirect_uri: client.redirect_uri,
          grant_type: "authorization_code",
          code: code,
        }),
      });
      setResponseData(response.data);
    }
  };

  const handleSubmit = async () => {
    window.location.href = authLink;
  };

  const handleChangeClientConfiguration = (e) => {
    setClient({
      ...client,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogout = async () => {
    window.location.href = logoutLink;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="bodyTop">
          <a
            className="logoButton"
            href="https://www.dentity.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={AuthImage.logoBlueWeb} alt={"dentity"} className="logo" />
          </a>
        </div>
        <div className="container">
          <div className="ctn-left">
            <div className="titleOIDC">Configure OIDC Client</div>
            <form
              className="form"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <label className="label">Authority</label>
              <input
                required
                value={client.authority}
                name="authority"
                onChange={handleChangeClientConfiguration}
                placeholder="https://oidc.dentity.com/oidc"
                className="input"
              />
              <label className="label">Client ID</label>
              <input
                required
                value={client.client_id}
                name="client_id"
                onChange={handleChangeClientConfiguration}
                className="input"
              />
              <label className="label">Client Secret</label>
              <input
                required
                value={client.client_secret}
                name="client_secret"
                onChange={handleChangeClientConfiguration}
                className="input"
              />
              <label className="label">Redirect Link</label>
              <input
                className="input"
                required
                name="redirect_uri"
                value={client.redirect_uri}
                onChange={handleChangeClientConfiguration}
              />

              <div className="container_btn" style={{ display: "flex" }}>
                <button
                  className="btn-submit btn-logout"
                  disabled={!responseData}
                  onClick={handleLogout}
                  type="button"
                >
                  Logout
                </button>
                <button
                  className="btn-submit"
                  onClick={handleSubmit}
                  disabled={
                    client.client_id === "" ||
                    client.client_secret === "" ||
                    client.redirect_uri === ""
                  }
                >
                  Grant Access
                </button>
              </div>
            </form>
          </div>
          <div className="ctn-right">
            <div className="titleOIDC">Response OIDC</div>
            <div
              style={{
                maxHeight: "55vh",
                border: "1px solid #c9c9c9",
                width: "90%",
                padding: 10,
                borderRadius: 5,
                overflow: "scroll",
                minHeight: "55vh",
              }}
            >
              <JsonFormatter
                json={responseData}
                tabWith={4}
                jsonStyle={{
                  propertyStyle: { color: "red" },
                  stringStyle: { color: "green" },
                  numberStyle: { color: "darkorange" },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
