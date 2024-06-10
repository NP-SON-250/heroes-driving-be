import express from "express";
import { serve, setup } from "swagger-ui-express";
const docRouter = express.Router();

const options = {
  openapi: "3.0.1",
  info: {
    title: "Heroes API",
    version: "1.0.0",
    description: "Heroes driving school documentation API",
  },
  basPath: "/",
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    {
      name: "Users",
      description: "Users' operations",
    },
    {
      name: "Exams",
      description: "Exams' operations",
    },
    {
      name: "Questions",
      description: "Questions' operations",
    },
    {
      name: "Options",
      description: "Options' operations",
    },
    {
      name: "Responses",
      description: "Response operations",
    },
    {
      name: "Payment Catecories",
      description: "Payment categories' operations",
    },
    {
      name: "Payments",
      description: "Payment operations",
    },
  ],
  paths: {
    "/api/v1/users/signup": {
      post: {
        tags: ["Users"],
        summary: "User sign up",
        description: "Create new user",
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  fullname: {
                    type: "string",
                  },
                  username: {
                    type: "string",
                  },
                  password: {
                    type: "string",
                  },
                },
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "User registered",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/v1/users/auth": {
      post: {
        tags: ["Users"],
        summary: "User login",
        description: "Login to the system",
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  username: {
                    type: "string",
                  },
                  password: {
                    type: "string",
                  },
                },
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "Login succeed",
          },
          400: {
            description: "Incorrect password",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/v1/users/all": {
      get: {
        tags: ["Users"],
        summary: "View all users",
        description: "Get all registered users",
        responses: {
          200: {
            description: "All users retrieved",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/v1/users/single/{id}": {
      get: {
        tags: ["Users"],
        summary: "View single user",
        description: "Get single user by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "User retrieved successfully",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "internal server error",
          },
        },
      },
    },
    "/api/v1/users/update/{id}": {
      put: {
        tags: ["Users"],
        summary: "User updating",
        description: "Update user by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  username: {
                    type: "string",
                  },
                  password: {
                    type: "string",
                  },
                  role: {
                    type: "string",
                    enum: ["user", "admin"],
                  },
                },
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "User Update succeed",
          },
          400: {
            description: "Username or phone number exist",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/v1/users/delete/{id}": {
      delete: {
        tags: ["Users"],
        summary: "Delete user",
        description: "Delete single user by Id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "User deleted successfully",
          },
          404: {
            description: "User not fount",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },

    // Exam routes

    "/api/v1/exams/record": {
      post: {
        tags: ["Exams"],
        summary: "Add exam",
        description: "Record new exam",
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                  },
                  time: {
                    type: "number",
                  },
                  category: {
                    type: "string",
                    enum: ["free", "paid"],
                  },
                },
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "Exam recorded",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/v1/exams/all": {
      get: {
        tags: ["Exams"],
        summary: "View all exams",
        description: "Get all exams registered",
        responses: {
          200: {
            description: "All exams retrieved",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/v1/exams/all/free": {
      get: {
        tags: ["Exams"],
        summary: "View all free exams",
        description: "Get all free exams registered",
        responses: {
          200: {
            description: "All free exams retrieved",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/v1/exams/all/paid": {
      get: {
        tags: ["Exams"],
        summary: "View all paid exams",
        description: "Get all paid exams registered",
        responses: {
          200: {
            description: "All paid exams retrieved",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/v1/exams/single/{id}": {
      get: {
        tags: ["Exams"],
        summary: "View single exam",
        description: "Get single exam by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Single exam retrieved",
          },
          404: {
            description: "Exam not found",
          },
          500: {
            description: "internal server error",
          },
        },
      },
    },
    "/api/v1/exams/update/{id}": {
      put: {
        tags: ["Exams"],
        summary: "Exam updating",
        description: "Update exam by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                  },
                  time: {
                    type: "number",
                  },
                  category: {
                    type: "string",
                    enum: ["free", "paid"],
                  },
                },
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "Exam Updated",
          },
          400: {
            description: "Exam title exist",
          },
          404: {
            description: "Exam not found",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/v1/exams/delete/{id}": {
      delete: {
        tags: ["Exams"],
        summary: "Delete exam",
        description: "Delete single exam by Id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Exam deleted",
          },
          404: {
            description: "Exam not fount",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },

    // Question routes
    "/api/v1/questions/record/{id}": {
      post: {
        tags: ["Questions"],
        summary: "Add question to exam",
        description: "Exam Id to add question",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  question: {
                    type: "string",
                  },
                },
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "Question added to the exam",
          },
          400: {
            description: "Bad request",
          },
          404: {
            description: "Exam not found",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },

    "/api/v1/questions/all/{id}": {
      get: {
        tags: ["Questions"],
        summary: "View all questions based on exam ID",
        description: "Get all registered questions to exam ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "All questions retrieved",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/v1/questions/all": {
      get: {
        tags: ["Questions"],
        summary: "View all questions",
        description: "Get all registered questions",
        responses: {
          200: {
            description: "All questions retrieved",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/v1/questions/single/{id}": {
      get: {
        tags: ["Questions"],
        summary: "View single question",
        description: "Get single question by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Single question retrieved",
          },
          404: {
            description: "Question not found",
          },
          500: {
            description: "internal server error",
          },
        },
      },
    },
    "/api/v1/questions/update/{id}": {
      put: {
        tags: ["Questions"],
        summary: "Question updating",
        description: "Update question by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  question: {
                    type: "string",
                  },
                },
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "Question Updated",
          },
          400: {
            description: "Question exist",
          },
          404: {
            description: "Question not found",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/v1/questions/delete/{id}": {
      delete: {
        tags: ["Questions"],
        summary: "Delete question",
        description: "Delete single question by Id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Question deleted",
          },
          404: {
            description: "Question not fount",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    // Options routes
    "/api/v1/options/record/{id}": {
      post: {
        tags: ["Options"],
        summary: "Add option to question",
        description: "Question Id to add option",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  option: {
                    type: "string",
                  },
                  points: {
                    type: "number",
                  },
                },
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "Option added to the quetion",
          },
          400: {
            description: "Bad request",
          },
          404: {
            description: "Question not found",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/v1/options/all/{id}": {
      get: {
        tags: ["Options"],
        summary: "View all options based on question ID",
        description: "Get all registered options to question ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "All options retrieved",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/v1/options/all": {
      get: {
        tags: ["Options"],
        summary: "View all options",
        description: "Get all registered options",
        responses: {
          200: {
            description: "All options retrieved",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/v1/options/single/{id}": {
      get: {
        tags: ["Options"],
        summary: "View single option",
        description: "Get single option by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Single option retrieved",
          },
          404: {
            description: "Option not found",
          },
          500: {
            description: "internal server error",
          },
        },
      },
    },
    "/api/v1/options/update/{id}": {
      put: {
        tags: ["Options"],
        summary: "Option updating",
        description: "Update option by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  option: {
                    type: "string",
                  },
                  points: {
                    type: "string",
                  },
                },
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "Option Updated",
          },
          400: {
            description: "Option exist",
          },
          404: {
            description: "Option not found",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/v1/options/delete/{id}": {
      delete: {
        tags: ["Options"],
        summary: "Delete option",
        description: "Delete single options by Id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Option deleted",
          },
          404: {
            description: "Option not fount",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },

    // Response routes
    "/api/v1/newresponses/add/{examId}": {
      post: {
        tags: ["Responses"],
        summary: "Respond to question",
        description: "Response Id to selected",
        parameters: [
          {
            name: "examId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  responses: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        questionId: {
                          type: "string",
                        },
                        selectedOptionId: {
                          type: "string",
                        },
                      },
                      required: ["questionId", "selectedOptionId"],
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Response added",
          },
          400: {
            description: "Bad request",
          },
          404: {
            description: "Exam not found",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/v1/newresponses/user": {
      get: {
        tags: ["Responses"],
        summary: "Get user-specific exam responses",
        description:
          "Fetches detailed information about the responses of the logged-in user",
        responses: {
          200: {
            description: "All responses retrieved",
          },
          404: {
            description: "No responses found for the user",
          },
          500: {
            description: "Failed to fetch user responses",
          },
        },
      },
    },

    // Payment category routes

    "/api/v1/categories/record": {
      post: {
        tags: ["Payment Catecories"],
        summary: "Add category",
        description: "Record new category",
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  exams: {
                    type: "number",
                  },
                  amount: {
                    type: "string",
                  },
                  duration: {
                    type: "number",
                  },
                },
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "Category recorded",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/v1/categories/all": {
      get: {
        tags: ["Payment Catecories"],
        summary: "View all categories",
        description: "Get all exams registered",
        responses: {
          200: {
            description: "All categories retrieved",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/v1/categories/single/{id}": {
      get: {
        tags: ["Payment Catecories"],
        summary: "View single category",
        description: "Get single category by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Single category retrieved",
          },
          404: {
            description: "category not found",
          },
          500: {
            description: "internal server error",
          },
        },
      },
    },
    "/api/v1/categories/update/{id}": {
      put: {
        tags: ["Payment Catecories"],
        summary: "Category updating",
        description: "Update category by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  exams: {
                    type: "number",
                  },
                  amount: {
                    type: "string",
                  },
                  duration: {
                    type: "number",
                  },
                },
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "Category Updated",
          },
          400: {
            description: "Category title exist",
          },
          404: {
            description: "Category not found",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/v1/categories/delete/{id}": {
      delete: {
        tags: ["Payment Catecories"],
        summary: "Delete category",
        description: "Delete single category by Id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Category deleted",
          },
          404: {
            description: "Category not fount",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },

    // Payment routes
    "/api/v1/payments/request/{id}": {
      post: {
        tags: ["Payments"],
        summary: "Request to pay for exams",
        description: "Initiate a payment request for an exam",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "The ID of the payment category",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  phone: {
                    type: "string",
                    description: "The phone number of the payer",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Payment request initiated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string" },
                    message: { type: "string" },
                    data: { type: "object" },
                  },
                },
              },
            },
          },
          404: {
            description: "Category not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string" },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string" },
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/api/v1/payments/status": {
      get: {
        tags: ["Payments"],
        summary: "Get transaction status",
        description: "Retrieve the status of a payment transaction",
        parameters: [
          {
            name: "XReferenceId",
            in: "query",
            description: "The reference ID of the payment transaction",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Payment status retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string" },
                    message: { type: "string" },
                    data: { type: "object" },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string" },
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        in: "header",
        name: "Authorization",
      },
    },
  },
};

docRouter.use("/", serve, setup(options));

export default docRouter;
