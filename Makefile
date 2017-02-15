all:
	npm run build
	cp etc/pydistutils.cfg.orig ~/.pydistutils.cfg
	pip install -r requirements.txt -t lib/
	yes | gcloud app deploy --project whatsgood-f1e9b

libs:
	pip install -r requirements.txt -t lib/
	pip install -r requirements.txt
