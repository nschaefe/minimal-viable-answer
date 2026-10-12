# p10_explain_tcp_vs_udp


═══════════════════════════════════════════════════════════════

## 📝 PROMPT

═══════════════════════════════════════════════════════════════


> When should I pick UDP over TCP?




═══════════════════════════════════════════════════════════════

## 🔹 MODE: DEFAULT

═══════════════════════════════════════════════════════════════


_latency=6084ms · in=15 · out=353 · chars=1372_


<br>

## When to Choose UDP over TCP

### Key Difference
TCP guarantees **reliable, ordered delivery** with error checking. UDP is **faster but unreliable** — packets can be lost, duplicated, or arrive out of order.

---

### Choose UDP When...

**Speed matters more than reliability**
- Real-time audio/video streaming
- Online gaming (player position updates)
- Live video calls (Zoom, WebRTC)

**Lost packets are acceptable or handled by the app**
- A dropped frame in a video call is better than freezing while waiting for retransmission
- Old game state data becomes irrelevant quickly

**Low latency is critical**
- TCP's handshake and retransmission add delay
- UDP has no connection setup overhead

**Broadcast/Multicast needed**
- Sending to multiple recipients simultaneously
- DNS queries
- DHCP

---

### Avoid UDP When...

- File transfers (corruption is unacceptable)
- Email, HTTP/web browsing
- Database transactions
- Anything requiring guaranteed delivery

---

### Common Examples

| Use Case | Protocol |
|----------|----------|
| Video streaming (Netflix) | TCP |
| Live video call | UDP |
| DNS lookup | UDP |
| File download | TCP |
| Online gaming | Usually UDP |
| VoIP | UDP |

---

### Practical Note
Many modern applications **build reliability on top of UDP** when they need both speed and some delivery guarantees (e.g., QUIC, which powers HTTP/3).


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: CAVEMAN

═══════════════════════════════════════════════════════════════


_latency=4468ms · in=1111 · out=194 · chars=703_


<br>

Use UDP when latency matters more than reliability.

**Pick UDP when:**
- Loss is tolerable or you handle retries yourself (games, live video, VoIP)
- Order doesn't matter
- You need multicast/broadcast
- Overhead of TCP handshake/state is unacceptable (DNS, IoT sensors)
- You implement custom reliability (QUIC, KCP, your own ARQ)

**Stay on TCP when:**
- All data must arrive in order (file transfer, HTTP, databases)
- You don't want to reimplement flow control and congestion control

Key tradeoff: TCP's retransmit waits for the lost packet before delivering later ones (head-of-line blocking). UDP lets you skip or interpolate. For real-time streams, a 200 ms stall is worse than a dropped frame.


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: MVA

═══════════════════════════════════════════════════════════════


_latency=1283ms · in=745 · out=38 · chars=151_


<br>

When you need low latency more than reliability: live video/audio, games, DNS lookups, or any case where a dropped packet is better than a delayed one.


<br><br>
