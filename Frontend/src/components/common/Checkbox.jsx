import React from "react";
import styled from "styled-components";

const Checkbox = ({ name, checked, onChange }) => {
  return (
    <StyledWrapper>
      <label className="cyberpunk-checkbox-label">
        <input
          type="checkbox"
          className="cyberpunk-checkbox"
          checked={checked}
          onChange={onChange}
        />
        {name}
      </label>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .cyberpunk-checkbox {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid #113d72;
    border-radius: 5px;
    background-color: transparent;
    display: inline-block;
    position: relative;
    margin-right: 10px;
    cursor: pointer;
  }

  .cyberpunk-checkbox:before {
    content: "";
    background-color: #113d72;
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    width: 10px;
    height: 10px;
    border-radius: 3px;
    transition: all 0.3s ease-in-out;
  }

  .cyberpunk-checkbox:checked:before {
    transform: translate(-50%, -50%) scale(1);
  }

  .cyberpunk-checkbox-label {
    font-size: 15px;
    color: #113d72;
    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;
  }
`;

export default Checkbox;
