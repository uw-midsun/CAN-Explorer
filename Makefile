# Virtualenv directory
VENV_DIR := .venv

###################################################################################################
# ENV SETUP

ROOT := $(shell pwd)

###################################################################################################

# PIP ENVIRONMENT SETUP

export PATH := $(ROOT)/$(VENV_DIR)/bin:$(PATH)

###################################################################################################

SCRIPTS_DIR := scripts

.PHONY: socketcan
socketcan:
	@sudo modprobe can
	@sudo modprobe can_raw
	@sudo modprobe vcan
	@sudo ip link add dev vcan0 type vcan || true
	@sudo ip link set up vcan0 || true
	@ip link show vcan0

# Note: ". .venv/bin/activate" is the /sh/ (and more portable way) of bash's "source .venv/bin/activate"
# If you are getting a "virtualenv: Command not found" error, try running `sudo pip3 install virtualenv`
.PHONY: install_requirements
install_requirements:
	@rm -rf $(VENV_DIR)
	@mkdir $(VENV_DIR)
	@virtualenv $(VENV_DIR)
	@. $(VENV_DIR)/bin/activate; \
	pip install -r requirements.txt

.PHONY: mock_can_data
mock_can_data: socketcan
ifneq (,$(findstring s,$(MAKEFLAGS)))
	+cd $(SCRIPTS_DIR) && python3 mock_can_data.py -s &
	+cd $(SCRIPTS_DIR) && python3 read_can_data.py -s &
else
	cd $(SCRIPTS_DIR) && python3 mock_can_data.py &
	cd $(SCRIPTS_DIR) && python3 read_can_data.py &
endif


.PHONY: stop_can_data
stop_can_data:
	@for i in $$(ps aux | grep "python3 mock_can_data.py" | grep -v "grep" | cut -d " " -f3); \
	do	\
		echo "Killing mock_can_data process {$$i}"; \
		kill $$i; \
	done
	@for i in $$(ps aux | grep "python3 read_can_data.py" | grep -v "grep" | cut -d " " -f3); \
	do	\
		echo "Killing read_can_data process {$$i}"; \
		kill $$i; \
	done

