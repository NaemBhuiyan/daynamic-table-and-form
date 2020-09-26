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

function GetForm() {
  const [formFields, setFormFields] = useState({});

  const [responseMessage, setResponseMessage] = useState("");

  let [repeatData, setRepeatData] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [errorMessage, setErrorMessage] = useState({});

  useEffect(() => {
    Axios.get("http://localhost/api/get_form.php").then((res) => {
      setFormFields(res.data.data.fields[0]);
    });
  }, []);

  const validForm = (type, value, name) => {
    if (value) {
      switch (type) {
        case "only_letters":
          return value.match(/^[a-zA-Z ]*$/)
            ? setErrorMessage({ invalid: false, message: "" })
            : setErrorMessage({
                invalid: true,
                message: "only  characters are support",
                name,
              });
        case "email|max:200":
          return value.length > 20
            ? setErrorMessage({
                invalid: true,
                message: "email must be in 20 character",
                name,
              })
            : setErrorMessage({ invalid: false, message: "" });
        default:
          return { invalid: false, message: "" };
      }
    }
  };

  const renderInput = (formObj) => {
    const {
      type,
      options,
      required,
      validate,
      repeater_fields,
      html_attr: { id, class: className },
    } = formObj[1];
    let fieldName = formObj[0];

    const handleChange = (target) => {
      let name = target.name;
      let value = target.value;
      const inputValues = { ...formValues };
      inputValues[name] = value;
      setFormValues(inputValues);
    };

    switch (type) {
      case "radio":
        return (
          <FormGroup id={id}>
            {options.map((option) => {
              return (
                <CustomInput
                  key={option.key}
                  type={type}
                  id={option.key}
                  label={option.label}
                  defaultChecked={formObj[1].default === option.key}
                  className={className}
                  name={fieldName}
                  value={option.key}
                  onChange={({ target }) => {
                    handleChange(target);
                  }}
                  inline
                />
              );
            })}
          </FormGroup>
        );
      case "select":
        return (
          <CustomInput
            type={type}
            id={id}
            required={required}
            name={fieldName}
            className={className}
            value={formValues[fieldName]}
            onChange={({ target }) => {
              handleChange(target);
            }}>
            {options.map((option) => (
              <option
                key={option.key}
                value={option.key}
                defaultValue={option.key === formObj[1].default}>
                {option.label}
              </option>
            ))}
          </CustomInput>
        );
      case "repeater":
        let repeaterFields = Array.of(repeater_fields, ...repeatData);

        return (
          <>
            <Button
              className="mb-4"
              onClick={() => {
                const newData = repeater_fields;
                const another = repeaterFields.map((item) => {
                  return { ...item, newData };
                });
                setRepeatData(another);
              }}>
              Add
            </Button>
            {repeaterFields.map((field, index) => {
              const {
                work_place: {
                  title: workPlaceTitle,
                  validate: repValidate,
                  ...workPlaceRest
                },
                designation: { title: designationTitle, ...designationRest },
              } = field;

              let repFieldName = Object.keys(field);
              return (
                <Row key={index}>
                  <Col className="mb-3 mr-3">
                    <Label className="mr-2">{workPlaceTitle} </Label>
                    <Input
                      {...workPlaceRest}
                      name={repFieldName[0]}
                      value={formValues[repFieldName[0]] || ""}
                      onChange={({ target }) => {
                        handleChange(target);
                        validForm(repValidate, target.value, repFieldName[0]);
                      }}
                      invalid={
                        errorMessage.name === repFieldName[0] &&
                        errorMessage.invalid
                      }
                    />
                    {errorMessage.name === repFieldName[0] && (
                      <FormText>{errorMessage.message}</FormText>
                    )}
                  </Col>
                  <Col className="mb-3 mr-3">
                    <Label className="mr-2">{designationTitle}</Label>
                    <Input
                      {...designationRest}
                      name={repFieldName[1]}
                      value={formValues[repFieldName[1]] || ""}
                      onChange={({ target }) => {
                        handleChange(target);
                      }}></Input>
                  </Col>
                </Row>
              );
            })}
          </>
        );
      default:
        return (
          <FormGroup>
            <Input
              className={className}
              id={id}
              required={required}
              type={type}
              name={fieldName}
              value={formValues[fieldName] || ""}
              onChange={({ target }) => {
                handleChange(target);
                validForm(validate, target.value, fieldName);
              }}
              invalid={errorMessage.name === fieldName && errorMessage.invalid}
            />
            {errorMessage.name === fieldName && (
              <FormText>{errorMessage.message}</FormText>
            )}
          </FormGroup>
        );
    }
  };
  console.log(formValues);
  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post("http://localhost/api/submit_form.php", formValues).then(
      (res) => {
        setResponseMessage(res.data.status);
      }
    );
    setFormValues({});
  };
  return (
    <Row>
      <Col className="mb-5">
        <h1 className="mt-5 text-center mb-5">Get Form</h1>
        <Form onSubmit={handleSubmit}>
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

export default GetForm;
