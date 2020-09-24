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
  const [message, setMessage] = useState("");

  useEffect(() => {
    Axios.get(`http://localhost/api/get_form.php?id=${userId}`).then((res) => {
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
          work_place: { title: workPlaceTitle, validate, ...workPlaceRest },
          designation: { title: designationTitle, ...designationRest },
        } = repeater_fields;
        return value.map((repField, index) => {
          return (
            <Row key={index}>
              <Col className="mb-3 mr-3">
                <Label className="mr-2">{workPlaceTitle} </Label>
                <Input
                  defaultValue={repField.work_place}
                  {...workPlaceRest}></Input>
              </Col>
              <Col className="mb-3 mr-3">
                <Label className="mr-2">{designationTitle}</Label>
                <Input
                  defaultValue={repField.designation}
                  {...designationRest}></Input>
              </Col>
            </Row>
          );
        });

      default:
        return (
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
                  <Col sm={10}>{renderInput(value, key)}</Col>
                </FormGroup>
              );
            })}
          <Button color="primary" type="submit">
            Update
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
