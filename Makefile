.PHONY: clean-docker
clean-docker:
	docker compose down -v --rmi local

.PHONY: test
test: 
	docker compose run -it --rm test pnpx playwright test
