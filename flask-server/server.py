from flask import Flask, jsonify, request
from flask_cors import CORS
import requests


class Telescope:
    current_angle = 12  # 현재 지구 자기장을 기준으로 얼마만큼 망원경이 회전해서 놓여있는가 (dec)

    current_latitude = 234  # 현재 위도 (dec)
    current_azimuth = 12  # 현재 방위각 (dec)

    current_latitude_motor_angle = 0  # 현재 위도 모터 각도 (dec)
    current_azimuth_motor_angle = 0  # 현재 방위각 모터 각도 (dec)

    target_arduino_server_ip = ""  # 타깃 아두이노 서버의 ip주소

    is_connect = False  # 망원경에 세팅된 값이 있으면 True, 아니면 False

    # -------------------------------------------------------------------------------------------

    def __init__(self):
        pass

    def connect(self, ip):
        self.target_arduino_server_ip = ip
        self.current_angle = 20
        self.current_latitude = 30
        self.current_azimuth = 49
        connect_Data = {'current_angle': self.current_angle,
                        'current_latitude': self.current_latitude, 'current_azimuth': self.current_azimuth}
        self.current_latitude_motor_angle = 0
        self.current_azimuth_motor_angle = 0
        return connect_Data

    def disconnect(self):
        self.target_arduino_server_ip = ""

        self.current_angle = 0

        self.current_latitude = '-'
        self.current_azimuth = '-'

        self.current_latitude_motor_angle = 0
        self.current_azimuth_motor_angle = 0

        connect_Data = {'current_angle': self.current_angle,
                        'current_latitude': self.current_latitude, 'current_azimuth': self.current_azimuth}
        return connect_Data

    def TurnMotor(self, latitude, azimuth):
        self.current_latitude_motor_angle += float(latitude)
        self.current_azimuth_motor_angle += float(azimuth)

        current_motor = {'L': self.current_latitude_motor_angle,
                         'A': self.current_azimuth_motor_angle}
        return current_motor

    def Park(self):
        pass

    def Abort(self):
        pass

    # 지구 자전 맞춰 GOTO


class CommandLogReport:
    pass


telescope = Telescope()
log = CommandLogReport()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/connect_to_telescope', methods=['GET'])
def connect_to_telescope():
    try:
        result = telescope.connect("http://192.168.32.108")
        return jsonify(result)
    except:
        pass


@app.route('/disconnect_to_telescope', methods=['GET'])
def disconnect_to_telescope():
    try:
        result = telescope.disconnect()
        return jsonify(result)
    except:
        pass


@app.route('/abort', methods=["GET"])
def abort():
    try:
        result = telescope.Abort()
        return jsonify(result)
    except:
        pass


@app.route('/park', methods=['GET'])
def init():
    try:
        result = telescope.Park()
        return jsonify(result)
    except:
        pass


@app.route("/AutoControl", methods=['POST'])
def auto_control():
    data = request.get_json()
    print(data)
    result2 = {"test": 1}
    print(result2)
    return jsonify(result2)


@app.route("/ManualControl", methods=['POST'])
def manual_control():
    data = request.get_json()
    print(data['Latitude'])
    print(data['Azimuth'])
    result2 = {"test": 1}
    print(result2)
    response = requests.post("http://192.168.32.108/M", json=data)
    print(telescope.TurnMotor(data['Latitude'], data['Azimuth']))
    return jsonify(result2)


@app.route('/ManualControl_Precise', methods=['POST'])
def manual_control_precise():
    data = request.get_json()
    print(data)
    result2 = {"test": 1}
    return jsonify(result2)
# 특정한 파이썬 함수의 예시


if __name__ == '__main__':
    app.run(debug=True)
