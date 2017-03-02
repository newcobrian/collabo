all:
	npm run build
	cp etc/pydistutils.cfg.orig ~/.pydistutils.cfg
	pip install six
	pip install six -t lib
	pip install -r requirements.txt -t lib/
	yes | gcloud app deploy --verbosity=info --stop-previous-version --project whatsgood-f1e9b

libs:
	pip install -r requirements.txt -t lib/
	pip install -r requirements.txt
