import React from "react";
import styled from "styled-components";

const DCard = ({ children }) => {
  return (
    <StyledWrapper>
      <div className="card">
        <span />
        <div className="content">{children}</div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    position: relative;
    width: auto;
    height: auto;
    color: #fff;
    transition: 0.5s;
    cursor: pointer;
  }

  .card:hover {
    transform: translateY(-20px);
  }

  .card::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: linear-gradient(45deg, #1a7ec9, #9013fe);
    border-radius: 1.2em;
  }

  .card::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #1a7ec9, #9013fe);
    filter: blur(30px);
  }

  .card span {
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 6px;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 2;
    border-radius: 1em;
  }

  .card span::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background-color: transparent;
  }

  .card .content {
    position: relative;
    padding: 10px;
    z-index: 10;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    font-weight: 800;
    font-size: 1.5em;
  }
`;

export default DCard;
