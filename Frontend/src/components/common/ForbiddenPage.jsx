import React from "react";
import styled from "styled-components";

const ForbiddenPage = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-950">
      <StyledWrapper>
        <div className="loader">
          <span>Un-Authorized Access (403)</span>
          <span>Un-Authorized Access (403)</span>
        </div>
      </StyledWrapper>
      <div className="block text-center">
        <h1 className="text-white text-9xl font-bold my-5">
          OO<span className="bg-red-600 text-white">P</span>S!...
        </h1>
        <h1 className="text-white text-2xl">
          You dont have privilages for this module. Contact System Administrator
          for access
        </h1>
      </div>
    </div>
  );
};

const StyledWrapper = styled.div`
  .loader {
    // position: relative;
  }

  .loader span {
    position: absolute;
    color: #fff;
    transform: translate(-2%, 100%);
    font-size: 68px;
    letter-spacing: 2px;
  }

  .loader span:nth-child(1) {
    color: transparent;
    -webkit-text-stroke: 0.3px #ff8c00;
  }

  .loader span:nth-child(2) {
    color: #ff8c00;
    -webkit-text-stroke: 1px #ff8c00;
    animation: uiverse723 3s ease-in-out infinite;
  }

  @keyframes uiverse723 {
    0%,
    100% {
      clip-path: polygon(
        0% 45%,
        15% 44%,
        32% 50%,
        54% 60%,
        70% 61%,
        84% 59%,
        100% 52%,
        100% 100%,
        0% 100%
      );
    }

    50% {
      clip-path: polygon(
        0% 60%,
        16% 65%,
        34% 66%,
        51% 62%,
        67% 50%,
        84% 45%,
        100% 46%,
        100% 100%,
        0% 100%
      );
    }
  }
`;

export default ForbiddenPage;
