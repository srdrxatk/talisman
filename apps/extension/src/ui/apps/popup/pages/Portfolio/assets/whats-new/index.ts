import { WhatsNewVersionData } from "./types"
import content1210 from "./v1.21.0"
import content1230 from "./v1.23.0"
import content1240 from "./v1.24.0"
import content1250 from "./v1.25.0"

export const latestUpdates: WhatsNewVersionData = {
  ...content1210,
  ...content1230,
  ...content1240,
  ...content1250,
}
