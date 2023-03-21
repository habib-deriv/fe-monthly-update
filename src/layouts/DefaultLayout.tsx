import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Logo from "@/assets/deriv-logo.svg";
import { Button, AppBar, Toolbar, Typography } from "@mui/material";
import { TLayoutProps } from ".";

const DefaultLayout = ({ children }: TLayoutProps) => {
  const { date } = useSelector((store: any) => store.settings);
  return (
    <React.Fragment>
      <AppBar position="static" classes={{ root: "bg-gray-100" }}>
        <Toolbar className="container mx-auto p-0">
          <img className="w-8 mr-2" src={Logo} alt="Deriv" />
          <div className="flex-grow">
            <Typography
              variant="h6"
              component="div"
              classes={{ root: "text-black uppercase text-base" }}
            >
              <Link to="/">
                FE Update Dashboard
                <span className="text-black text-xs uppercase ml-2">
                  {date.year}
                </span>
              </Link>
            </Typography>
          </div>

          <div>
            <Link to="/settings">
              <Button disableElevation size="small">
                Settings
              </Button>
            </Link>
            <Link to="/tasks">
              <Button
                disableElevation
                size="small"
                variant="outlined"
                className="ml-2"
              >
                Tasks
              </Button>
            </Link>
            <Link to="/road">
              <Button
                disableElevation
                size="small"
                variant="outlined"
                className="ml-2"
              >
                Road Ahead
              </Button>
            </Link>
            <Link to="/stars">
              <Button
                disableElevation
                size="small"
                variant="outlined"
                className="ml-2"
              >
                Stars of the Month
              </Button>
            </Link>
            <Link to="/list">
              <Button
                disableElevation
                size="small"
                variant="contained"
                className="ml-2"
              >
                Download Files
              </Button>
            </Link>
          </div>
        </Toolbar>
      </AppBar>

      <div className="container mx-auto main-content">{children}</div>

      <div id="modal-portal"></div>
      <footer className="text-center p-4 bg-black text-base-content">
        <div>
          <p className="text-white text-xs">
            Copyright © 2022 - 23 - All right reserved by Cashier Team
          </p>
        </div>
      </footer>
    </React.Fragment>
  );
};

export default DefaultLayout;
