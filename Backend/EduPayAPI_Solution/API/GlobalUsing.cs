global using EduPayAPI.Application;
global using EduPayAPI.Infrastructure;
global using MediatR;
global using Microsoft.OpenApi.Models;
global using Carter;
global using Serilog;
global using FluentValidation;
global using EduPayAPI.API;
global using EduPayAPI.API.Middlewares;
global using EduPayAPI.API.DTOs.Auth;
global using EduPayAPI.Application.Features.Auth.Login;
global using EduPayAPI.Application.Features.Auth.Register;
global using Microsoft.AspNetCore.Authentication.JwtBearer;
global using Microsoft.IdentityModel.Tokens;
global using System.Text;
global using System.Threading.RateLimiting;
global using Hangfire;
global using EduPayAPI.Application.Common.Interfaces;
global using EduPayAPI.Infrastructure.Jobs;
global using EduPayAPI.Application.Common.Exceptions;
global using DevExpress.AspNetCore.Reporting.WebDocumentViewer;
global using DevExpress.AspNetCore.Reporting.WebDocumentViewer.Native.Services;
global using Microsoft.AspNetCore.Mvc;
global using EduPayAPI.Domain.Enums;
global using EduPayAPI.Application.Features.Auth.Logout;
global using EduPayAPI.Application.Features.Auth.ForgotPassword;
global using EduPayAPI.Application.Features.Auth.RefreshTokens;
global using EduPayAPI.Application.Features.Auth.ResetPassword;
global using EduPayAPI.Application.Features.Auth.VerifyOtp;
global using EduPayAPI.API.DTOs.Branches;
global using EduPayAPI.Application.Features.Branches.Create;
global using EduPayAPI.Application.Features.Branches.Delete;
global using EduPayAPI.Application.Features.Branches.GetAll;
global using EduPayAPI.Application.Features.Branches.GetById;
global using EduPayAPI.Application.Features.Branches.Update;
global using EduPayAPI.Application.Features.Classes.BulkCreate;
global using EduPayAPI.Application.Features.Classes.Delete;
global using EduPayAPI.Application.Features.Classes.GetAll;
global using EduPayAPI.API.DTOs.ImportClass;
global using EduPayAPI.Application.Features.Classes.ImportClass;
global using ClosedXML.Excel;
global using EduPayAPI.Application.Features.GlobalSearch;
global using EduPayAPI.API.DTOs.Grade;
global using EduPayAPI.Application.Features.Grades.Create;
global using EduPayAPI.Application.Features.Grades.Delete;
global using EduPayAPI.Application.Features.Grades.GetAll;
global using EduPayAPI.Application.Features.Grades.Update;
global using EduPayAPI.API.DTOs.Report;
global using EduPayAPI.Application.Features.Report;
global using EduPayAPI.Application.Features.Schools.GetMainSchool;
global using EduPayAPI.Application.Features.Schools.Update;
global using EduPayAPI.Application.Features.SchoolYears.Create;
global using EduPayAPI.Application.Features.SchoolYears.GetById;
global using EduPayAPI.Application.Features.SchoolYears.GetSchoolYear;
global using EduPayAPI.Application.Features.SchoolYears.Delete;
global using EduPayAPI.Application.Features.SchoolYears.Update;
global using EduPayAPI.Application.Features.Statistics;
global using EduPayAPI.API.DTOs.Student;
global using EduPayAPI.Application.Features.Students.Create;
global using EduPayAPI.Application.Features.Students.Delete;
global using EduPayAPI.API.DTOs.ImportStudent;
global using EduPayAPI.Application.Features.Students.Update;
global using EduPayAPI.Application.Features.Students.GetAll;







