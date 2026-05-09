# # Image build
# FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
# WORKDIR /app

# COPY . .

# RUN dotnet restore
# RUN dotnet publish API/API.csproj -c Release -o out


# # Image runtime
# FROM mcr.microsoft.com/dotnet/aspnet:10.0
# WORKDIR /app

# RUN apt-get update && apt-get install -y \
#     libc6-dev \
#     libgdiplus \
#     libx11-dev \
#     libfontconfig1 \
#     libfreetype6 \
#     libharfbuzz0b \
#     libpng16-16 \
#     libjpeg-turbo8 \
#     libxrender1 \
#     libxext6 \
#     libglib2.0-0 \
#     libgssapi-krb5-2 \
#     && rm -rf /var/lib/apt/lists/*

# COPY --from=build /app/out .

# EXPOSE 8080
# ENTRYPOINT ["dotnet", "API.dll"]


# FROM mcr.microsoft.com/dotnet/sdk:10.0

# WORKDIR /app

# # 🔥 giữ nguyên thư viện bạn cần
# RUN apt-get update && apt-get install -y \
#     libc6-dev \
#     libgdiplus \
#     libx11-dev \
#     libfontconfig1 \
#     libfreetype6 \
#     libharfbuzz0b \
#     libpng16-16 \
#     libjpeg-turbo8 \
#     libxrender1 \
#     libxext6 \
#     libglib2.0-0 \
#     libgssapi-krb5-2 \
#     && rm -rf /var/lib/apt/lists/*

# COPY . .

# RUN dotnet restore API/API.csproj

# CMD ["dotnet", "watch", "run", "--project", "API/API.csproj", "--urls", "http://0.0.0.0:8080"]



# Image build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

COPY . .

RUN dotnet restore API/API.csproj
RUN dotnet publish API/API.csproj -c Release -o out


# Image runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app

RUN apt-get update && apt-get install -y \
    libc6-dev \
    libgdiplus \
    libx11-dev \
    libfontconfig1 \
    libfreetype6 \
    libharfbuzz0b \
    libpng16-16 \
    libjpeg-dev \
    libxrender1 \
    libxext6 \
    libglib2.0-0 \
    libgssapi-krb5-2 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/out .

# ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "API.dll"]
