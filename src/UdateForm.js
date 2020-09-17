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

function UpdateForm() {
  const [formFields, setFormFields] = useState({});
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [detailsValue, setDetailsValue] = useState("");
  const [genderValue, setGenderValue] = useState("");
  const [otherValue, setOtherValue] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    Axios.get("http://localhost/api/get_form.php?id=67").then((res) => {
      setFormFields(res.data.data.fields[0]);
    });
  }, []);

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
    const { type, options, title, value } = formObj[1];
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
                  label={option.key}
                  defaultChecked={value === option.key}
                  onChange={({ target }) => {
                    console.log(target.value);
                    getSetFunction(title, target.value);
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
            name="selectgender"
            defaultValue={value}
            onChange={({ target }) => {
              getSetFunction(title, target.value);
            }}>
            {options.map((option) => (
              <option key={option.key} defaultValue={value}>
                {option.key}
              </option>
            ))}
          </CustomInput>
        );
      case "repeater":
        return value.map((rep, index) => {
          return (
            <Form inline key={index}>
              <FormGroup className="mb-3 mr-3">
                <Label className="mr-2">Work place</Label>
                <Input defaultValue={rep.work_place}></Input>
              </FormGroup>
              <FormGroup className="mb-3 mr-3">
                <Label className="mr-2">Designation</Label>
                <Input defaultValue={rep.designation}></Input>
              </FormGroup>
            </Form>
          );
        });

      default:
        return (
          <Input
            type={type}
            name={title}
            defaultValue={value}
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
        <h1 className="mt-5 text-center mb-5">Update Form</h1>
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
          <Alert color="success" className="mt-4">
            {message}
          </Alert>
        )}
      </Col>
    </Row>
  );
}

export default UpdateForm;
