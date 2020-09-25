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
  FormText,
} from "reactstrap";

function UpdateForm({ match }) {
  const {
    params: { userId },
  } = match;
  const [formFields, setFormFields] = useState({});
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [detailsValue, setDetailsValue] = useState("");
  const [genderValue, setGenderValue] = useState("");
  const [otherValue, setOtherValue] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [designationValue, setDesignationValue] = useState("");
  const [workPlaceValue, setWorkPlaceValue] = useState("");

  useEffect(() => {
    Axios.get(`http://localhost/api/get_form.php?id=${userId}`).then((res) => {
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
      case "Work place":
        return workPlaceValue;
      case "Designation":
        return designationValue;
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
      case "Designation":
        return setDesignationValue(value);
      case "Work place":
        console.log(value);
        return setWorkPlaceValue(value);
      default:
        return setOtherValue(value);
    }
  };
  const validForm = (type, value) => {
    switch (type) {
      case "only_letters":
        // console.log(value);
        return value.match(/^[A-Za-z]+$/) || value === ""
          ? { invalid: false, message: "" }
          : { invalid: true, message: "only  characters are support" };
      case "email|max:200":
        return value.length > 20
          ? { invalid: true, message: "email must be in 20 character" }
          : { invalid: false, message: "" };
      default:
        return { invalid: false, message: "" };
    }
  };
  const renderInput = (formObj, key) => {
    const {
      type,
      options,
      title,
      required,
      validate,
      repeater_fields,
      value,
      html_attr: { id, class: className },
    } = formObj[1];
    // repeater_fields && console.log(repeater_fields);

    switch (type) {
      case "radio":
        return (
          <FormGroup>
            {options.map((option) => {
              return (
                <CustomInput
                  key={option.key}
                  type="radio"
                  id={id}
                  label={option.label}
                  name={formObj[0]}
                  required={required}
                  className={className}
                  defaultChecked={value === option.key}
                  onChange={({ target }) => {
                    console.log(target.value);
                    getSetFunction(title, target.value);
                  }}
                  name={formObj[1]}
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
            name={formObj[0]}
            className={className}
            defaultValue={value}
            required={required}
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
        const {
          work_place: {
            title: workPlaceTitle,
            validate: repValidate,
            ...workPlaceRest
          },
          designation: { title: designationTitle, ...designationRest },
        } = repeater_fields;

        return value.map((repField, index) => {
          return (
            <Row key={index}>
              <Col className="mb-3 mr-3">
                <Label className="mr-2">{workPlaceTitle} </Label>
                <Input
                  defaultValue={repField.work_place}
                  {...workPlaceRest}
                  onChange={({ target }) => {
                    getSetFunction(workPlaceTitle, target.value);
                  }}
                  invalid={
                    getInputValue(workPlaceTitle) &&
                    validForm(repValidate, getInputValue(workPlaceTitle))
                      .invalid
                  }
                />
                <FormText>
                  {
                    validForm(repValidate, getInputValue(workPlaceTitle))
                      .message
                  }
                </FormText>
              </Col>
              <Col className="mb-3 mr-3">
                <Label className="mr-2">{designationTitle}</Label>
                <Input
                  defaultValue={repField.designation}
                  {...designationRest}
                  onChange={({ target }) => {
                    getSetFunction(designationTitle, target.value);
                  }}></Input>
              </Col>
            </Row>
          );
        });

      default:
        const { invalid, message } = validForm(validate, getInputValue(title));
        return (
          <>
            <Input
              className={className}
              id={id}
              required={required}
              type={type}
              name={formObj[0]}
              defaultValue={value}
              onChange={({ target }) => {
                getSetFunction(title, target.value);
              }}
              invalid={invalid}
            />
            <FormText>{message}</FormText>
          </>
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
              setResponseMessage(res.data.status);
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
                  <Col sm={10}>{renderInput(value, key)}</Col>
                </FormGroup>
              );
            })}
          <Button color="primary" type="submit">
            Update
          </Button>
        </Form>
        {responseMessage && (
          <Alert
            color={responseMessage === "success" ? "success" : "danger"}
            className="mt-4">
            {responseMessage}
          </Alert>
        )}
      </Col>
    </Row>
  );
}

export default UpdateForm;
