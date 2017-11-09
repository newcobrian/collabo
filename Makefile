build: FORCE
	npm run build

local: build
	dev_appserver.py .

deploy: build libs
	yes | gcloud app deploy --verbosity=info --stop-previous-version --project views-18a9f

libs:
	cp etc/pydistutils.cfg.orig setup.cfg
	pip install -r requirements.txt -t lib/
	rm -f setup.cfg
	pip install -r requirements.txt

FORCE: ;

