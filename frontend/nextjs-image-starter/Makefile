IMAGE_NAME := nextjs-image-starter
TAG := latest

.PHONY: build
docker:
	docker build -t $(IMAGE_NAME):$(TAG) .

.PHONY: run
run:
	docker run -p 8080:443 $(IMAGE_NAME):$(TAG)

.PHONY: clean
clean:
	docker rmi $(IMAGE_NAME):$(TAG)
