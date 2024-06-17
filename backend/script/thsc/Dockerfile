FROM python:3.8-alpine

WORKDIR /app

COPY . .

RUN apk add --virtual .build-deps gcc musl-dev \
     && pip install js2py \
     && apk del .build-deps gcc musl-dev

CMD ["python", "./thsc_upload.py"]