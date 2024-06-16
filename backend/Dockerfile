FROM python:3.10-alpine

WORKDIR /app

COPY requirements.txt ./
RUN apk add --no-cache --virtual .build-deps gcc musl-dev \
&& pip3 install --no-cache-dir -r requirements.txt \
&& apk del .build-deps gcc musl-dev 

COPY . .

EXPOSE 80

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80", "--reload"]