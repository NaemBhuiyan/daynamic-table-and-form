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
  Alert,
} from "reactstrap";

function GetForm() {
  const [formFields, setFormFields] = useState({});
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [detailsValue, setDetailsValue] = useState("");
  const [genderValue, setGenderValue] = useState("");
  const [otherValue, setOtherValue] = useState("");
  const [message, setMessage] = useState("");
  let [repeatData, setRepeatData] = useState({});
  let count = 1;

  useEffect(() => {
    Axios.get("http://localhost/api/get_form.php").then((res) => {
      setFormFields(res.data.data.fields[0]);
    });
  }, []);
  console.log("hellp");
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
  const handleRepeater = (repeater_fields) => {
    const keyValue = Object.keys(repeater_fields);
    const ProValue = Object.values(repeater_fields);
    for (let i = 0; i < count; i++) {
      console.log(i);

      Object.assign(repeater_fields, {
        [keyValue[0] + i]: ProValue[0],
        [keyValue[1] + i]: ProValue[1],
      });
    }
    console.log(repeater_fields);
    count++;
  };
  const renderInput = (formObj) => {
    const {
      type,
      options,
      title,
      required,
      validate,
      repeater_fields,
      html_attr: { id, class: className },
    } = formObj[1];
    repeater_fields && console.log(repeater_fields);

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
                    getSetFunction(formObj[1].title, target.value);
                  }}
                  name={formObj[0]}
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
            id={id}
            required={required}
            name={formObj[0]}
            value={getInputValue(title)}
            onChange={({ target }) => {
              getSetFunction(title, target.value);
            }}
            className={className}>
            <option value="" disabled>
              Select Gender
            </option>
            {options.map((option) => (
              <option key={option.key} value={option.label}>
                {option.label}
              </option>
            ))}
          </CustomInput>
        );
      case "repeater":
        return (
          <>
            <Button
              className="mb-4"
              onClick={() => {
                handleRepeater(repeater_fields);
              }}>
              Add
            </Button>
            {Object.entries(repeater_fields).map((fields, index) => {
              const fieldName = fields[0];
              const { title, required, validate } = fields[1];
              return (
                <Row key={index} form>
                  <Col className="mb-3">
                    <Label>{title}</Label>
                    <Input required={required} name={fieldName}></Input>
                  </Col>
                </Row>
              );
            })}
          </>
        );
      default:
        return (
          <Input
            className={className}
            id={id}
            required={required}
            type={type}
            name={formObj[0]}
            value={getInputValue(title)}
            onChange={({ target }) => {
              getSetFunction(title, target.value);
            }}
          />
        );
    }
  };

  return (
    <Row>
      <Col>
        <h1 className="mt-5 text-center mb-5">Get Form</h1>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            Axios.post("http://localhost/api/submit_form.php", {
              user_name: nameValue,
              user_email: emailValue,
              details: detailsValue,
              user_gender: genderValue,
              otherValue,
            }).then((res) => {
              setMessage(res.data.status);
            });
          }}>
          {Object.keys(formFields).length &&
            Object.entries(formFields).map((value, key) => {
              return (
                <FormGroup row key={key}>
                  <Label
                    for={value[1].title}
                    sm={2}
                    className="font-weight-bold">
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
        {message && (
          <Alert
            color={message === "success" ? "success" : "danger"}
            className="mt-4">
            {message}
          </Alert>
        )}
      </Col>
    </Row>
  );
}

export default GetForm;
