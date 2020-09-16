import React, { useEffect, useState } from "react";
import Axios from "axios";
import {
  Col,
  Input,
  Row,
  FormGroup,
  Label,
  Form,
  CustomInput,
  Button,
} from "reactstrap";

function GetForm() {
  const [formFields, setFormFields] = useState({});
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [detailsValue, setDetailsValue] = useState("");
  const [genderValue, setGenderValue] = useState("");
  const [otherValue, setOtherValue] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    Axios.get("http://localhost/api/get_form.php").then((res) => {
      setFormFields(res.data.data.fields[0]);
    });
  }, []);
  const getInputValue = (title) => {
    switch (title) {
      case "Full name":
        return nameValue;
      case "Email":
        return emailValue;
      case "Gender":
        return genderValue;
      case "Details":
        return detailsValue;
      default:
        return otherValue;
    }
  };
  const getSetFunction = (title, value) => {
    switch (title) {
      case "Full name":
        return setNameValue(value);
      case "Email":
        return setEmailValue(value);
      case "Gender":
        return setGenderValue(value);
      case "Details":
        return setDetailsValue(value);
      default:
        return setOtherValue(value);
    }
  };
  const renderInput = (formObj) => {
    const { type, options } = formObj[1];
    switch (type) {
      case "radio":
        return (
          <FormGroup>
            {options.map((option) => {
              return (
                <CustomInput
                  key={option.key}
                  type="radio"
                  id={option.label}
                  label={option.label}
                  value={option.label}
                  onChange={({ target }) => {
                    console.log(target.value);
                    getSetFunction(formObj[1].title, target.value);
                  }}
                  name="genderName"
                  inline
                />
              );
            })}
          </FormGroup>
        );
      case "select":
        return (
          <CustomInput
            type="select"
            id="exampleCustomSelect"
            name="gender"
            value={getInputValue(formObj[1].title)}
            onChange={({ target }) => {
              getSetFunction(formObj[1].title, target.value);
            }}
            {...formObj[1].html_attr}>
            {options.map((option) => (
              <option key={option.key} value={option.label}>
                {option.label}
              </option>
            ))}
          </CustomInput>
        );

      default:
        return (
          <Input
            {...formObj[1]}
            type={formObj[1].type}
            name={formObj[1].title}
            value={getInputValue(formObj[1].title)}
            onChange={({ target }) => {
              getSetFunction(formObj[1].title, target.value);
            }}
          />
        );
    }
  };

  return (
    <Row>
      <Col>
        <h1 className="mt-5">Get Form</h1>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            Axios.post("http://localhost/api/submit_form.php", {
              nameValue,
              emailValue,
              detailsValue,
              genderValue,
              otherValue,
            }).then((res) => {
              console.log(res);
            });
          }}>
          {Object.keys(formFields).length &&
            Object.entries(formFields).map((value, key) => {
              return (
                <FormGroup row key={key}>
                  <Label for={value[1].title} sm={2}>
                    {value[1].title}
                  </Label>
                  <Col sm={10}>{renderInput(value)}</Col>
                </FormGroup>
              );
            })}
          <Button color="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Col>
    </Row>
  );
}

export default GetForm;
