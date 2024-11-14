import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Passport from './pages/Passport';
import ErrorPage from './pages/ErrorPage';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import SmallBusinessLoan from './pages/SmallBusinessLoan/SmallBusinessLoan';
import Success from './pages/Success';
import SubmittedLoan from './pages/SmallBusinessLoan/SubmittedLoan';
import TrafficTicket from './pages/TrafficTicket/TrafficTicket';
import UseCaseIndex from './pages/UseCaseIndex';
import SubmittedTrafficTicket from './pages/TrafficTicket/SubmittedTrafficTicket';
import PageNotFound from './pages/PageNotFound';
import axios from 'axios';
import RequireAuth from './components/RequireAuth';
import './assets/scss/main.scss';
import Header from './components/Header';
import WitnessStatement from './pages/TrafficTicket/WitnessStatement';
import { handleError } from './api/apiHelper';

function App() {
  let mountedRef = useRef(true);
  const [textContent, setTextContent] = useState('');

  useEffect(() => {
    // Load in the text content on page load.
    getTextContent();

    // Clean up
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // GETs the static text content from the server that will be used to
  // populate the app.
  async function getTextContent() {
    try {
      const response = await axios.get('http://localhost:5000/assets/text.json');
      // Only set states if the component is mounted, otherwise return null.
      if (!mountedRef.current) return null;

      setTextContent(response.data);
    } catch (error) {
      console.log('Error getting static text asset.');
      console.log(error);
      const errorPageText = handleError(error);
      <Navigate to="/error" state={errorPageText} />;
    }
  }

  return (
    <>
      {textContent ? (
        <Router>
          <Header text={textContent.header} />
          <Routes>
            <Route
              path="/"
              element={
                <Login
                  text={textContent.login}
                  githubText={textContent.header}
                  btsText={textContent.behindTheScenes.login}
                />
              }
            />

            <Route element={<RequireAuth />}>
              <Route
                path="/index"
                element={
                  <Home
                    text={textContent.home}
                    footerText={textContent.footer}
                  />
                }
              />
            </Route>

            <Route element={<RequireAuth />}>
              <Route
                path="apply-for-passport"
                element={
                  <Passport
                    text={textContent.passport}
                    formText={textContent.formLabels}
                    btsText={textContent.behindTheScenes}
                  />
                }
              />
            </Route>

            <Route element={<RequireAuth />}>
              <Route
                path="apply-for-small-business-loan"
                element={<UseCaseIndex />}
              >
                <Route
                  path=""
                  element={
                    <SmallBusinessLoan
                      text={textContent.smallBusinessLoan}
                      formText={textContent.formLabels}
                      btsText={textContent.behindTheScenes}
                      userFlowText={textContent.userFlowInfo.smallBusinessLoan}
                    />
                  }
                />
                <Route
                  path="submitted-loan"
                  element={
                    <SubmittedLoan text={textContent.smallBusinessLoan} />
                  }
                />
              </Route>
            </Route>

            <Route element={<RequireAuth />}>
              <Route path="receive-traffic-ticket" element={<UseCaseIndex />}>
                <Route
                  path=""
                  element={
                    <TrafficTicket
                      text={textContent.trafficTicket}
                      formText={textContent.formLabels}
                      btsText={textContent.behindTheScenes}
                      userFlowText={textContent.userFlowInfo.trafficTicket}
                    />
                  }
                />
                <Route
                  path="submitted-ticket"
                  element={
                    <SubmittedTrafficTicket text={textContent.trafficTicket} />
                  }
                />
                <Route
                  path="request-witness-statement"
                  element={
                    <WitnessStatement
                      text={textContent.trafficTicket}
                      formText={textContent.formLabels}
                      btsText={textContent.behindTheScenes}
                    />
                  }
                />
              </Route>
            </Route>

            <Route
              path="success"
              element={<Success text={textContent.success} />}
            />
            <Route path="error" element={<ErrorPage />} />
            <Route
              path="*"
              element={<PageNotFound text={textContent.pageNotFound} />}
            />
          </Routes>
          <footer className="copyright">{textContent.footer.copyright}</footer>
        </Router>
      ) : (
        // Display nothing while static assets are being loaded in.
        <></>
      )}
    </>
  );
}

export default App;
