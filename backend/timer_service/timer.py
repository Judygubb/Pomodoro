class Timer:
    def __init__(self, duration=1500):
        self.duration = duration
        self.time_remaning = duration
        self.is_running = False

    def start(self):
        self.is_running = True

    def pause(self):
        self.is_running = False

    def reset(self):
        self.pause()
        self.time_remaning = self.duration

    def get_state(self):
        return {
            "time_remaning": self.time_remaning,
            "is_running": self.is_running,
            "duration": self.duration,
            "formatted time": self.get_formated_time()
        }

    def tick(self):
        if self.is_running and self.time_remaning > 0:
            self.time_remaning -= 1
            return self.get_state()
        return self.get_state()

    def get_formated_time(self):
        min = self.time_remaining // 60
        sec = self.time_remaining % 60
        return f"{min:02d}:{sec:02d}"
