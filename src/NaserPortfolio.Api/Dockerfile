FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /source

COPY ["Directory.Build.props", "."]
COPY ["NuGet.config", "."]
COPY ["src/NaserPortfolio.Domain/NaserPortfolio.Domain.csproj", "src/NaserPortfolio.Domain/"]
COPY ["src/NaserPortfolio.Application/NaserPortfolio.Application.csproj", "src/NaserPortfolio.Application/"]
COPY ["src/NaserPortfolio.Infrastructure/NaserPortfolio.Infrastructure.csproj", "src/NaserPortfolio.Infrastructure/"]
COPY ["src/NaserPortfolio.Api/NaserPortfolio.Api.csproj", "src/NaserPortfolio.Api/"]
RUN dotnet restore "src/NaserPortfolio.Api/NaserPortfolio.Api.csproj"

COPY . .
RUN dotnet publish "src/NaserPortfolio.Api/NaserPortfolio.Api.csproj" \
    --configuration Release \
    --no-restore \
    --output /app/publish \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080
COPY --from=build /app/publish .
USER app
ENTRYPOINT ["dotnet", "NaserPortfolio.Api.dll"]
